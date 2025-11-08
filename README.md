# Techtonic - AI-Powered Tools & Integrations

This repository contains various AI-powered tools and integrations.

## 🧠 Freeplane AI Integration

Complete AI integration for Freeplane mind mapping software. Includes:

- **MCP Server** - Model Context Protocol server for Freeplane
- **HTTP Bridge** - REST API for n8n and other tools
- **n8n Workflows** - Pre-built automation examples
- **AI Features** - Auto-expand, summarize, research

**[📖 Full Documentation](./FREEPLANE_AI_INTEGRATION.md)**

### Quick Start

```bash
# Setup
cd freeplane-mcp-server
npm install && npm run build
cd ..

# Install bridge dependencies
npm install express @anthropic-ai/sdk @modelcontextprotocol/sdk

# Set API key
export ANTHROPIC_API_KEY="your-key"

# Start HTTP bridge
node mcp-http-bridge.js
```

See [FREEPLANE_AI_INTEGRATION.md](./FREEPLANE_AI_INTEGRATION.md) for complete setup and usage.

## 📁 Project Structure

```
techtonic/
├── freeplane-mcp-server/        # MCP server for Freeplane
├── n8n-workflows/               # Automation workflows
├── mcp-http-bridge.js           # HTTP API bridge
├── N8N_INTEGRATION_GUIDE.md     # n8n setup guide
└── FREEPLANE_AI_INTEGRATION.md  # Complete documentation
```

## 🚀 Features

- Read/write Freeplane mind maps programmatically
- AI-powered node expansion with Claude
- Automated research and content population
- n8n workflow integration
- REST API for external tools
- File watching and auto-processing

## 📚 Resources

- [Freeplane Integration Docs](./FREEPLANE_AI_INTEGRATION.md)
- [n8n Integration Guide](./N8N_INTEGRATION_GUIDE.md)
- [MCP Server README](./freeplane-mcp-server/README.md)

## License

MIT
