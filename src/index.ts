#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import fs from "fs/promises";
import { createReadStream } from "fs";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	Tool,
} from "@modelcontextprotocol/sdk/types.js";
import path from "path";

// Command line argument parsing 
// 安全目录逻辑，暂时注释
// const args = process.argv.slice(2);
// if (args.length === 0) {
// 	console.error("Usage: mcp-server-textin <allowed-directory> [additional-directories...]");
// 	process.exit(1);
// }

if (!process.env.APP_ID || !process.env.APP_SECRET) {
	console.error("APP_ID or APP_SECRET environment variable is not set");
	process.exit(1);
}

const OCR_SERVICE_API = "https://api.textin.com/ai/service/v2/recognize/multipage";
const EXTRACT_KEYINFO_API = "https://api.textin.com/ai/service/v1/entity_extraction";
const DOC_TO_MARKDOWN_API = "https://api.textin.com/ai/service/v1/pdf_to_markdown";
const OCR_SERVICE_HEADERS = {
	"Content-Type": "application/octet-stream",
	"x-ti-app-id": process.env.APP_ID,
	"x-ti-secret-code": process.env.APP_SECRET,
};
const URL_PATTERN = /^(https?:\/\/)/;

function expandHome(filepath: string): string {
	if (filepath.startsWith('~/') || filepath === '~') {
		return path.join(process.env.HOME ?? '/', filepath.slice(1));
	}
	return filepath;
}

// Normalize all paths consistently
function normalizePath(p: string): string {
	return path.normalize(p);
}

// Security utilities
async function validatePath(requestedPath: string): Promise<string> {
	// Check if the path is a URL (http:// or https://)
	if (URL_PATTERN.test(requestedPath)) {
		return requestedPath;
	}

	const expandedPath = expandHome(requestedPath);
	const absolute = path.isAbsolute(expandedPath)
		? path.resolve(expandedPath)
		: path.resolve(process.cwd(), expandedPath);

	// Handle symlinks by checking their real path
	try {
		const realPath = await fs.realpath(absolute);
		return normalizePath(realPath);
	} catch (error) {
		// For new files that don't exist yet, verify parent directory
		const parentDir = path.dirname(absolute);
		try {
			const realParentPath = await fs.realpath(parentDir);
			return normalizePath(realParentPath);
		} catch (err) {
			throw new Error(`Parent directory does not exist: ${parentDir}, err: ${error} ${err}`);
		}
	}
}

const ReadFileArgsSchema = z.object({
	path: z.string(),
	key: z.array(z.string()).default([]),
	table_header: z.array(z.string()).default([]),
});

function removeBoundingRegions(obj: any): any {
	if (Array.isArray(obj)) {
		return obj.map(removeBoundingRegions);
	} else if (obj !== null && typeof obj === 'object') {
		const newObj: any = {};
		for (const key in obj) {
			if (key === 'bounding_regions') {
				// 跳过这个字段
				continue;
			}
			newObj[key] = removeBoundingRegions(obj[key]);
		}
		return newObj;
	} else {
		// 基本类型直接返回
		return obj;
	}
}


const OCR_TOOL: Tool = {
	name: "recognition_text",
	description: "Text recognition from images, Word documents, and PDF files.",
	inputSchema: {
		type: "object",
		properties: {
			path: {
				type: "string",
				format: "file-path",
				description: `Read the complete contents of a file from the file system or a URL (HTTP/HTTPS) pointing to a document.
				 The resource MUST be one of the supported types: PDF, Image (Jpeg, Jpg, Png, Bmp).
				`
			}
		},
		required: ["path"]
	}
};

const EXTRACT_KEYINFO_TOOL: Tool = {
	name: "general_information_extration",
	description: "Automatically identify and extract information from documents, or identify and extract user-specified information.",
	inputSchema: {
		type: "object",
		properties: {
			path: {
				type: "string",
				format: "file-path",
				description: `Read the complete contents of a file from the file system or a URL (HTTP/HTTPS) pointing to a document.
				 The resource MUST be one of the supported types: PDF, Image (Jpeg, Jpg, Png, Bmp), Microsoft Office Documents (Word, Excel).
				`
			},
			key: {
				type: "array",
				items: { type: "string" },
				format: "key",
				description: "The non-tabular text information that the user wants to identify, input format is an array of strings."
			},
			table_header: {
				type: "array",
				items: { type: "string" },
				format: "table_header",
				description: "The table information that the user wants to identify, input format is an array of strings."
			}
		},
		required: ["path"]
	}
};

const DOC_TO_MARKDOWN_TOOL: Tool = {
	name: "doc_to_markdown",
	description: "Convert images, PDFs, and Word documents to Markdown.",
	inputSchema: {
		type: "object",
		properties: {
			path: {
				type: "string",
				format: "file-path",
				description: `Read the complete contents of a file from the file system or a URL (HTTP/HTTPS) pointing to a document.
				 The resource MUST be one of the supported types: PDF, Image (Jpeg, Jpg, Png, Bmp), Microsoft Office Documents (Word, Excel).
				`
			}
		},
		required: ["path"]
	}
};

const READ_FILE_TOOL = {
	name: "read_file",
	description:
		"Read the complete contents of a file from the file system.",
	inputSchema: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description: "The document path"
			}
		},
		required: ["path"]
	}
};

const TEXT_TOOLS = [
	OCR_TOOL,
	EXTRACT_KEYINFO_TOOL,
	DOC_TO_MARKDOWN_TOOL,
	// READ_FILE_TOOL,
] as const;

interface URLParams {
	[key: string]: string | number | boolean;
}

// call textin api
async function callApi(filePath: string, API: string, params?: URLParams): Promise<any> {
	let fileStream: NodeJS.ReadableStream | Buffer;

	// Check if filePath is a URL (http:// or https://)
	if (URL_PATTERN.test(filePath)) {
		try {
			// Download the file from the web URL
			const response = await axios.get(filePath, { responseType: 'arraybuffer' });
			fileStream = response.data;
		} catch (error) {
			console.error("Error downloading file from URL:", error);
			throw error;
		}
	} else {
		// Use the local file path
		fileStream = createReadStream(filePath);
	}

	if (params) {
		const urlParams = new URLSearchParams(params as Record<string, string>).toString();
		API = `${API}?${urlParams}`;
	}

	try {
		const response = await axios.post(API, fileStream, {
			headers: {
				...OCR_SERVICE_HEADERS
			}
		});

		// Check if the returned JSON contains 'code' and if it's 200
		if (response.data.code !== 200) {
			console.error("Error from TextIn MCP service:", response.data.message ?? 'Unknown error');
			throw new Error(`API returned error code: ${response.data.code} message: ${response.data.message}`);
		}

		return response.data;
	} catch (error) {
		console.error("Error calling OCR service:", error);
		throw error;
	}
}

async function handleReadFileTool(validPath: string): Promise<{ content: { type: string; text: string }[] }> {
	const content = await fs.readFile(validPath, 'utf-8');
	return { content: [{ type: 'text', text: content }] };
}

async function handleOcrTool(validPath: string): Promise<{ content: { type: string; text: string }[] }> {
	const urlParams = {
		client_type: "mcp"
	};
	const result = await callApi(validPath, OCR_SERVICE_API, urlParams);
	const extractedText = result.result.pages
		.map((page: any) => page.lines.map((line: any) => line.text).join('\n'))
		.join('\n');
	return { content: [{ type: 'text', text: extractedText }] };
}

async function handleExtractKeyInfoTool(validPath: string, key: string, table_header: string): Promise<{ content: { type: string; text: string }[] }> {
	const ie_type = (key !== '' || table_header !== '') ? "close_ie" : "auto_structure";

	const urlParams = {
		ie_type: ie_type,
		client_type: "mcp",
		key: key,
		table_header: table_header
	};

	const result = await callApi(validPath, EXTRACT_KEYINFO_API, urlParams);

	//去除一些无意义的json信息
	const transformedResult = result.result.detail_structure.map((item: any) => {
		return {
			fields: Object.fromEntries(
				Object.entries(item.fields).map(([_key, value]) => [
					_key,
					(value as any).map((fieldItem: any) => fieldItem.value)
				])
			),
			tables_relationship: removeBoundingRegions(item.tables_relationship),
			stamps: item.stamps.map((stamp: any) => {
				const { position, ...rest } = stamp;
				return rest;
			})
		};
	});
	return { content: [{ type: 'text', text: JSON.stringify(transformedResult) }] };
}

async function handleDocToMarkdownTool(validPath: string): Promise<{ content: { type: string; text: string }[] }> {
	const urlParams = {
		client_type: "mcp"
	};
	const result = await callApi(validPath, DOC_TO_MARKDOWN_API, urlParams);

	//去除一些无意义的json信息
	const transformedResult = result.result.markdown;
	return { content: [{ type: 'text', text: transformedResult }] };
}

/**
 * Create an MCP server
 */
const server = new Server(
	{
		name: "textin-mcp",
		version: "0.1.0",
	},
	{
		capabilities: {
			resources: {},
			tools: {},
			prompts: {},
		},
	}
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: TEXT_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	try {
		const { name, arguments: args } = request.params;
		const parsed = ReadFileArgsSchema.safeParse(args);
		if (!parsed.success) {
			throw new Error(`Invalid arguments: ${parsed.error}`);
		}
		const validPath = await validatePath(parsed.data.path);

		switch (name) {
			case READ_FILE_TOOL.name:
				return await handleReadFileTool(validPath);
			case OCR_TOOL.name:
				return await handleOcrTool(validPath);
			case EXTRACT_KEYINFO_TOOL.name:
				return await handleExtractKeyInfoTool(validPath, (parsed.data.key || []).join(','), (parsed.data.table_header || []).join(','));
			case DOC_TO_MARKDOWN_TOOL.name:
				return await handleDocToMarkdownTool(validPath);
			default:
				throw new Error('Unknown tool name');
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		return {
			content: [{ type: "text", text: `Error: ${errorMessage}` }],
			isError: true,
		};
	}

});


/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((error) => {
	console.error("Server error:", error);
	process.exit(1);
});
