# TextIn OCR MCP
<p align="center">
<img align="center" src="https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/logo.png" width="800" alt="TextIn">
</p>

English | [中文](./README_CHS.md)

## TextIn OCR MCP Server

TextIn MCP Server is a tool for extracting text and performing OCR on documents, including document text recognition, ID recognition, and invoice recognition. It also supports converting documents into Markdown format.

<!-- <a href="https://glama.ai/mcp/servers/@intsig-textin/textin-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@intsig-textin/textin-mcp/badge" alt="Textin Server MCP server" />
</a> -->

### Tools
- `recognition_text`
  - Text recognition from images, Word documents, and PDF files.
  - Inputs:
    - `path` (string, required): `file path` or `a URL (HTTP/HTTPS) pointing to a document`
  - Return: Text of the document.
  - Supports conversion for:
    - PDF
    - Image (Jpeg, Jpg, Png, Bmp)

- `doc_to_markdown`
  - Convert images, PDFs, and Word documents to Markdown.
  - Inputs:
    - `path` (string, required): `file path` or `a URL (HTTP/HTTPS) pointing to a document`
  - Return: Markdown of the document.
  - Supports conversion for:
    - PDF
    - Microsoft Office Documents (Word, Excel)
    - Image (Jpeg, Jpg, Png, Bmp)

- `general_information_extration`
  - Automatically identify and extract information from documents, or identify and extract user-specified information.
  - Inputs:
    - `path` (string, required): `file path` or `a URL (HTTP/HTTPS) pointing to a document`
    - `key` (string[], optional): The non-tabular text information that the user wants to identify, input format is an array of strings.
    - `table_header` (string[], optional): The table information that the user wants to identify, input format is an array of strings.
  - Return: The key information JSON.
  - Supports conversion for:
    - PDF
    - Microsoft Office Documents (Word, Excel)
    - Image (Jpeg, Jpg, Png, Bmp)

When the input is a URL, it does not support handling access to protected resources.

## Setup

### APP_ID and APP_SECRET

Click [here](https://www.textin.com/user/login?from=github_mcp) to register for a TextIn account.

Get Textin APP_ID and APP_SECRET by following the instructions [here](https://www.textin.com/doc/guide/account/%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96app%20id?status=first).

### NPX

```json
{
  "mcpServers": {
    "textin-ocr": {
      "command": "npx",
      "args": [
        "-y",
        "@intsig/server-textin"
      ],
      "env": {
        "APP_ID": "<YOUR_APP_ID>",
        "APP_SECRET": "<YOUR_APP_SECRET>",
        "MCP_SERVER_REQUEST_TIMEOUT": "600000"
      },
      "timeout": 600
    }
  }
}
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.