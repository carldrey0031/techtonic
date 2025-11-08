# Freeplane AI Integration Project

Complete solution for integrating AI capabilities with Freeplane mind mapping software using MCP (Model Context Protocol) and n8n automation.

## 🎯 Project Overview

This project provides:

1. **MCP Server** - Model Context Protocol server for Freeplane integration
2. **HTTP Bridge** - REST API for connecting n8n and other tools
3. **n8n Workflows** - Pre-built automation workflows
4. **AI-Powered Features** - Automatic expansion, summarization, and research

## 📁 Project Structure

```
techtonic/
├── freeplane-mcp-server/      # MCP server implementation
│   ├── src/
│   │   ├── index.ts           # Main MCP server
│   │   ├── freeplane-parser.ts # XML parsing utilities
│   │   └── types.ts           # TypeScript types
│   ├── package.json
│   └── README.md              # MCP server documentation
│
├── n8n-workflows/             # Pre-built n8n automations
│   ├── 1-watch-and-expand-mindmap.json
│   ├── 2-scheduled-research-assistant.json
│   ├── 3-webhook-create-mindmap.json
│   ├── 4-email-to-mindmap.json
│   └── 5-weekly-summary-reporter.json
│
├── mcp-http-bridge.js         # HTTP bridge for n8n
├── N8N_INTEGRATION_GUIDE.md   # Complete n8n setup guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Freeplane installed
- Anthropic API key (for AI features)
- n8n installed (for automations)

### Installation

1. **Clone the repository**

```bash
cd techtonic
```

2. **Install MCP Server**

```bash
cd freeplane-mcp-server
npm install
npm run build
cd ..
```

3. **Install Bridge Dependencies**

```bash
npm install express @anthropic-ai/sdk @modelcontextprotocol/sdk
```

4. **Set Environment Variables**

```bash
export ANTHROPIC_API_KEY="your-anthropic-api-key"
```

5. **Start the HTTP Bridge**

```bash
node mcp-http-bridge.js
```

The bridge will start on `http://localhost:3000`

### Test Installation

```bash
# Check health
curl http://localhost:3000/health

# Create a test mind map
curl -X POST http://localhost:3000/api/mindmap/create \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/tmp/test.mm",
    "root_text": "Test Mind Map",
    "initial_children": ["Topic 1", "Topic 2", "Topic 3"]
  }'

# Read the mind map
curl -X POST http://localhost:3000/api/mindmap/read \
  -H "Content-Type: application/json" \
  -d '{"file_path": "/tmp/test.mm"}'
```

## 🎨 Features

### 1. Mind Map Operations

- **Read** - Parse and display mind map structure
- **Create** - Generate new mind maps programmatically
- **Update** - Modify existing nodes
- **Search** - Find nodes by text content

### 2. AI-Powered Features

- **Auto-Expand** - AI generates subtopics for any node
- **Summarize** - Create summaries of branches
- **Research** - Automatically research and populate topics
- **Reorganize** - AI suggests better structure

### 3. n8n Automation

- **File Watching** - Auto-process changes
- **Scheduled Tasks** - Periodic research and updates
- **Webhooks** - API-driven mind map creation
- **Email Integration** - Create mind maps from emails
- **Reporting** - Weekly activity summaries

## 📚 Documentation

- **[MCP Server Documentation](./freeplane-mcp-server/README.md)** - Complete MCP server API reference
- **[n8n Integration Guide](./N8N_INTEGRATION_GUIDE.md)** - Step-by-step n8n setup and workflows
- **[API Reference](#api-reference)** - HTTP Bridge API documentation

## 🔧 API Reference

### HTTP Bridge Endpoints

#### Health Check

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "mcpReady": true,
  "anthropicConfigured": true,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Read Mind Map

```
POST /api/mindmap/read
```

Request:
```json
{
  "file_path": "/path/to/map.mm",
  "max_depth": 10
}
```

Response:
```json
{
  "success": true,
  "file_path": "/path/to/map.mm",
  "node_count": 42,
  "outline": "- Root Topic\n  - Subtopic 1\n  - Subtopic 2",
  "map": { ... }
}
```

#### Create Mind Map

```
POST /api/mindmap/create
```

Request:
```json
{
  "file_path": "/path/to/new-map.mm",
  "root_text": "My Project",
  "initial_children": ["Planning", "Execution", "Review"]
}
```

Response:
```json
{
  "success": true,
  "message": "Created mind map at /path/to/new-map.mm",
  "file_path": "/path/to/new-map.mm",
  "root_node_id": "ID_ROOT_1234567890"
}
```

#### Expand Node with AI

```
POST /api/mindmap/expand-with-ai
```

Request:
```json
{
  "file_path": "/path/to/map.mm",
  "node_id": "ID_123456789",
  "prompt": "Focus on technical implementation",
  "num_subtopics": 5
}
```

Response:
```json
{
  "success": true,
  "message": "Successfully added 5 child nodes",
  "node_text": "Machine Learning",
  "subtopics": [
    "Data Collection and Preprocessing",
    "Model Selection and Training",
    "Evaluation Metrics",
    "Deployment Strategy",
    "Monitoring and Maintenance"
  ]
}
```

#### Search Nodes

```
POST /api/mindmap/search
```

Request:
```json
{
  "file_path": "/path/to/map.mm",
  "search_text": "research",
  "case_sensitive": false
}
```

Response:
```json
{
  "success": true,
  "count": 3,
  "results": [
    {"id": "ID_111", "text": "Research Phase"},
    {"id": "ID_222", "text": "Market Research"},
    {"id": "ID_333", "text": "Research Findings"}
  ]
}
```

#### Add Child Nodes

```
POST /api/mindmap/add-children
```

Request:
```json
{
  "file_path": "/path/to/map.mm",
  "parent_node_id": "ID_123456789",
  "children": [
    {"text": "New Topic 1"},
    {"text": "New Topic 2", "attributes": {"@_COLOR": "#FF0000"}}
  ]
}
```

## 💡 Use Cases

### 1. Automated Knowledge Base

- Watch documentation folders
- Auto-create mind maps from new content
- AI-generated structure and organization

### 2. Project Planning Assistant

- Create project mind maps via API
- AI expands work breakdown structure
- Integrates with project management tools

### 3. Research Automation

- Mark topics for research with `[RESEARCH]` tag
- Scheduled research updates
- Web search results added as nodes

### 4. Meeting Notes Processing

- Email meeting notes
- Auto-convert to structured mind map
- AI summarizes action items

### 5. Knowledge Synthesis

- Combine multiple mind maps
- AI identifies patterns and connections
- Generate comprehensive summaries

## 🎯 Example Workflows

### Example 1: Auto-Expand on File Save

1. Edit mind map in Freeplane
2. Add `[EXPAND]` tag to any node
3. Save file
4. n8n detects change
5. AI automatically expands marked nodes

### Example 2: Weekly Research Digest

1. Create mind map with research topics
2. Mark nodes with `[RESEARCH]` tag
3. n8n runs every Monday
4. Searches web for each topic
5. Adds findings as child nodes
6. Emails summary report

### Example 3: API-Driven Mind Map Creation

```bash
# Create mind map from external system
curl -X POST http://localhost:3000/api/mindmap/create \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/mindmaps/customer-feedback.mm",
    "root_text": "Customer Feedback Analysis",
    "initial_children": ["Feature Requests", "Bug Reports", "Praise"]
  }'

# Get root node ID
RESPONSE=$(curl -s -X POST http://localhost:3000/api/mindmap/read \
  -H "Content-Type: application/json" \
  -d '{"file_path": "/mindmaps/customer-feedback.mm", "max_depth": 1}')

NODE_ID=$(echo $RESPONSE | jq -r '.map.map.node."@_ID"')

# Expand with AI
curl -X POST http://localhost:3000/api/mindmap/expand-with-ai \
  -H "Content-Type: application/json" \
  -d "{
    \"file_path\": \"/mindmaps/customer-feedback.mm\",
    \"node_id\": \"$NODE_ID\",
    \"prompt\": \"Generate detailed categories for analyzing customer feedback\",
    \"num_subtopics\": 7
  }"
```

## 🔒 Security Best Practices

1. **API Keys**: Never commit API keys to version control
2. **File Paths**: Validate and sanitize all file paths
3. **Access Control**: Implement authentication for HTTP bridge
4. **Rate Limiting**: Protect against abuse
5. **Input Validation**: Validate all user input

## 🐛 Troubleshooting

### Bridge Won't Start

```bash
# Check Node.js version
node --version  # Should be 18+

# Check dependencies
npm list

# Test MCP server directly
cd freeplane-mcp-server
node dist/index.js
```

### AI Operations Fail

```bash
# Verify API key
echo $ANTHROPIC_API_KEY

# Test Claude API
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-5-20250929","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}'
```

### Mind Map Parse Errors

- Ensure file is valid `.mm` format
- Open in Freeplane to validate
- Check file permissions
- Verify file path is absolute

### n8n Connection Issues

```bash
# Test bridge is running
curl http://localhost:3000/health

# Check n8n can reach bridge
# In n8n, test HTTP Request node with GET to /health
```

## 📈 Performance Tips

- Cache frequently accessed mind maps
- Use batch operations for multiple nodes
- Implement file locking for concurrent access
- Set appropriate timeouts for AI operations
- Monitor memory usage with large maps (1000+ nodes)

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Additional MCP tools
- More n8n workflow examples
- Support for other mind mapping formats
- Performance optimizations
- Test coverage

## 📄 License

MIT License - See LICENSE file

## 🔗 Related Resources

- [Freeplane Official Site](https://www.freeplane.org/)
- [Freeplane Documentation](https://docs.freeplane.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic Claude](https://www.anthropic.com/)
- [n8n Automation](https://n8n.io/)

## 💬 Support

- **Issues**: Open a GitHub issue
- **Questions**: See documentation or ask in discussions
- **Security**: Email security concerns privately

## 🎉 Acknowledgments

- Freeplane team for the amazing mind mapping software
- Anthropic for Claude and MCP
- n8n community for automation platform

---

**Built with ❤️ for the mind mapping and automation community**
