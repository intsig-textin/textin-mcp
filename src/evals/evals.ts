//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const recognition_textEval: EvalFunction = {
    name: "recognition_text Tool Evaluation",
    description: "Evaluates text recognition from documents",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please extract all readable text from the file located at /files/sample-receipt.pdf.");
        return JSON.parse(result);
    }
};

const general_information_extrationEval: EvalFunction = {
    name: "general_information_extration Evaluation",
    description: "Evaluates the tool's ability to automatically and intelligently extract key information from documents",
    run: async () => {
        const result = await grade(openai("gpt-4"), "I have a PDF file at '/documents/sample.pdf'. Please extract the key details about the product's specifications, brand, and features, and summarize them clearly.");
        return JSON.parse(result);
    }
};

const doc_to_markdownEval: EvalFunction = {
    name: "doc_to_markdownEval",
    description: "Evaluates the doc_to_markdown tool by converting a PDF to Markdown",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please convert the PDF at /path/to/sample.pdf into Markdown.");
        return JSON.parse(result);
    }
};

const read_fileEval: EvalFunction = {
    name: "read_file Tool Evaluation",
    description: "Evaluates the read_file tool's ability to read the contents of a file from the file system",
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please read the file at path '/tmp/testfile.txt' and return its contents.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [recognition_textEval, general_information_extrationEval, doc_to_markdownEval, read_fileEval]
};
  
export default config;
  
export const evals = [recognition_textEval, general_information_extrationEval, doc_to_markdownEval, read_fileEval];