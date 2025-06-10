# TextIn OCR MCP
<p align="center">
<img align="center" src="https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/logo.png" width="800" alt="TextIn">
</p>

[English](./README.md) | 中文

## 什么是 TextIn OCR MCP 服务？

[TextIn OCR](https://www.textin.com/register/code/68KPRK)是[合合信息](https://www.textin.com/)一款专为大语言模型（LLM）下游任务设计的通用文档解析服务。它支持多种 MCP 协议客户端，能够识别文档或图片中的文字信息，包括通金融报告、国家标准、学术论文、企业公告、使用手册、财务发票等文档提取关键信息，并支持将文档内容还原成标准的 Markdown 格式。TextIn 支持 OCR 文字识别，覆盖 10 多种常见文档版式，并支持 52+ 种语言，帮助各类大模型在理解、生成、问答等场景中高效利用文档数据。

## 如何使用TextIn OCR MCP 服务？

已为您部署好了云端的[TextIn OCR](https://www.textin.com/register/code/68KPRK)服务，您需要前往[TextIn OCR注册链接](https://www.textin.com/register/code/68KPRK)，登录注册后获取 APP_ID 和 APP_SECRET。目前 MCP 服务已支持添到智能体和工作流中。

## TextIn OCR MCP 工具
- `recognition_text`：通用文字识别
  - 从图片、Word 文档和 PDF 文件中进行文字识别。
  - 输入:
    - `path` (string, required): `文件路径` or `指向文档的 HTTP/HTTPS 网址`
  - 输出: 文档的文字内容。
  - 支持格式:
    - pdf, jpeg, jpg, png, bmp

- `doc_to_markdown`：通用文档解析
  - 将图片、PDF 和 Word 文档转换为 Markdown。
  - 输入:
    - `path` (string, required): `文件路径` or `指向文档的 HTTP/HTTPS 网址`
  - 输出: 文档的 Markdown 格式内容。
  - 支持格式:
    - png, jpg, jpeg, pdf, bmp, tiff, webp, doc, docx, html, mhtml, xlsx, pptx, txt

- `general_information_extration`：智能文档抽取
  - 自动识别并提取文档中的信息，或识别并提取用户指定的信息。
  - 输入:
    - `path` (string, required): `文件路径` or `指向文档的 HTTP/HTTPS 网址`
    - `key` (string[], optional): 用户希望识别的非表格文本信息，输入格式为字符串数组。
    - `table_header` (string[], optional): 用户希望识别的表格信息，输入格式为字符串数组。
  - 输出: 关键信息的 JSON 格式内容。
  - 支持格式:
    - pdf, word, excel, jpeg, jpg, png, bmp


- 当输入是URL时，它不支持处理对受保护资源的访问。

## TextIn OCR MCP 服务的关键特性
  - 表格识别更精准：有线表、无线表、密集表，都能精准识别，单元格合并、跨页表格合并也不在话下
  - 解析速度极快：100页长文档，最快仅需1.5s，不仅支撑在线应用提供极致用户体验，也能大幅缩短离线处理时间
  - 高稳定性：单日数百万级调用量，成功率可达99.999%，来自亿级用户体量APP的技术，稳定可靠
  - 格式种类多：一个接口，支持 PDF、Word（doc/docx）、常见图片（jpg/png/webp/tiff）、HTML 等多种文件格式一次请求，即可获取文字、表格、标题层级、公式、手写字符、图片信息

![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/2.jpg)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/3.jpg)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/4.jpg)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/5.jpg)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/6.jpg)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/7.jpg)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/8.jpg)


## TextIn OCR MCP 服务的使用案例
  - 金融报告数据结构化
    - 快速提取和标准化财报、研报等金融文档中的关键数据，助力数据分析与决策支持。
  - 教育题库清洗
    - 高效解析各类教材、试卷文档，提取题目信息并标准化格式，提升题库构建效率。
  - RAG 知识库建设
    - 解析非结构化文档内容，转化为结构化知识片段，赋能大模型检索增强生成（RAG）应用。
  - 文档翻译与格式保留
    - 结合 OCR 和文档结构解析，实现多语种文档的内容翻译与格式还原。
  - 在线判卷与自动批改
    - 识别学生答题内容，提取并结构化，支持自动评分与结果分析。
  - 在线文档问答系统
    - 将文档解析为可检索格式，支撑基于文档的智能问答系统，提升信息查询效率。
  - RPA / Agent 自动化处理
    - 作为机器人流程自动化（RPA）和智能代理（Agent）的前置模块，实现文档识别、内容提取与智能分发。
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/9.png)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/10.png)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/11.png)
![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/12.png)


## 安装使用

### 获取 APP_ID and APP_SECRET

前往[TextIn OCR注册链接](https://www.textin.com/register/code/68KPRK)，登录注册后获取 APP_ID 和 APP_SECRET。目前 MCP 服务已支持添到智能体和工作流中。

![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/1.jpg)

### NPX安装

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
## 使用示例
  - 将某企业年报转换为 Markdown
  - 将企业资质证书的扫描件转换为 Markdown
  - 将企业项目报告的 Word 文档转换为 Markdown
  - 将企业新闻稿的 PDF 转换为 Markdown
  - 请将企业的文档进行OCR识别转换为 md
  - 将企业培训材料的 PPT 转换为 Markdown
  - Tools 示例：
    ![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/13.jpg)
  - MCP Agent 示例
    ![](https://ccidownload.blob.core.chinacloudapi.cn/download/2025/LLMS/15.jpg)


## License

[TextIn OCR MCP](https://github.com/intsig-textin/textin-mcp)GitHub地址：https://github.com/intsig-textin/textin-mcp

本MCP服务器根据MIT许可证授权。这意味着您可以自由使用、修改和分发该软件，但需遵守MIT许可证的条款和条件。更多详情，请参阅项目仓库中的LICENSE文件。