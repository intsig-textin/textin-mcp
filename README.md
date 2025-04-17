# Textin OCR MCP

MCP Server for the Textin OCR.

## Tools
- `recognition_text`
  - Text recognition from images, Word documents, and PDF files.
  - Input: `file path` (string)
  - Return: Text of the document.

- `doc_to_markdown`
  - Convert images, PDFs, and Word documents to Markdown.
  - Input: `file path` (string)
  - Return: Markdown of the document.

- `general_information_extration`
  - Automatically and intelligently extract key information from documents.
  - Input: `file path` (string)
  - Return: The key information JSON.



## Setup

### APP_KEY and APP_SECRET
Get a Textin APP_KEY and APP_SECRET by following the instructions [here](https://www.textin.com/doc/guide/account/%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96app%20id?status=first).

### NPX

```json
{
  "mcpServers": {
    "textin-ocr": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/textin-ocr-mcp"
      ],
      "env": {
        "APP_ID": "<YOUR_APP_ID>",
        "APP_SECRET": "<YOUR_APP_SECRET>",
        "MCP_SERVER_REQUEST_TIMEOUT": "600000"
      },
      "timeout": 600
    }
}
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.