# n8n Integration Guide for Freeplane MCP Server

This guide explains how to integrate the Freeplane MCP Server with n8n for powerful automation workflows.

## Table of Contents

1. [Setup](#setup)
2. [MCP Server as HTTP Endpoint](#mcp-server-as-http-endpoint)
3. [Pre-built Workflows](#pre-built-workflows)
4. [Common Patterns](#common-patterns)
5. [Troubleshooting](#troubleshooting)

## Setup

### Prerequisites

- n8n installed (self-hosted or cloud)
- Freeplane MCP Server running
- HTTP endpoint for MCP calls (we'll create this)

### 1. Create MCP HTTP Bridge

Since n8n works best with HTTP endpoints, create a simple Express server to bridge MCP and HTTP:

```javascript
// mcp-http-bridge.js
import express from 'express';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

let mcpClient = null;

// Initialize MCP client
async function initMCP() {
  const serverProcess = spawn('node', ['./freeplane-mcp-server/dist/index.js'], {
    env: { ...process.env, ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY }
  });

  const transport = new StdioClientTransport({
    command: serverProcess,
  });

  mcpClient = new Client({
    name: 'mcp-http-bridge',
    version: '1.0.0',
  }, {
    capabilities: {},
  });

  await mcpClient.connect(transport);
  console.log('MCP Client connected');
}

// Call MCP tool endpoint
app.post('/mcp/call-tool', async (req, res) => {
  try {
    const { tool, arguments: args } = req.body;

    const result = await mcpClient.callTool({
      name: tool,
      arguments: args,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List available tools
app.get('/mcp/tools', async (req, res) => {
  try {
    const tools = await mcpClient.listTools();
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mcpConnected: mcpClient !== null });
});

const PORT = process.env.PORT || 3000;

initMCP().then(() => {
  app.listen(PORT, () => {
    console.log(`MCP HTTP Bridge running on port ${PORT}`);
  });
}).catch(console.error);
```

### 2. Install Bridge Dependencies

```bash
npm install express @modelcontextprotocol/sdk
```

### 3. Start the Bridge

```bash
export ANTHROPIC_API_KEY="your-api-key"
node mcp-http-bridge.js
```

Now you have an HTTP endpoint at `http://localhost:3000` that n8n can call!

## Pre-built Workflows

Import these workflows from the `n8n-workflows/` directory:

### 1. Watch and Auto-Expand Mind Map

**File:** `1-watch-and-expand-mindmap.json`

**What it does:**
- Watches a directory for changes to .mm files
- Reads the mind map
- Finds nodes marked with `[EXPAND]`
- Uses AI to automatically expand those nodes
- Sends notification when complete

**Setup:**
1. Import the workflow JSON
2. Configure the file watcher path
3. Update HTTP Request nodes with your bridge URL
4. Set up Slack notifications (optional)

### 2. Scheduled Research Assistant

**File:** `2-scheduled-research-assistant.json`

**What it does:**
- Runs every 6 hours
- Finds nodes marked with `[RESEARCH]`
- Performs web searches for each topic
- Adds research findings as child nodes

**Setup:**
1. Import the workflow
2. Configure the mind map file path
3. Add Google Search API credentials
4. Adjust schedule as needed

### 3. Webhook - Create Mind Map

**File:** `3-webhook-create-mindmap.json`

**What it does:**
- Exposes a webhook endpoint
- Receives topic via POST request
- Creates new mind map file
- Auto-expands root node with AI
- Returns file path and details

**Usage:**
```bash
curl -X POST http://your-n8n-url/webhook/create-mindmap \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Machine Learning Project",
    "file_path": "/mindmaps/ml-project.mm"
  }'
```

### 4. Email to Mind Map

**File:** `4-email-to-mindmap.json`

**What it does:**
- Watches inbox for emails with "Mind Map:" in subject
- Parses email content into hierarchical structure
- Creates mind map file
- Uploads to Google Drive
- Sends confirmation email

**Setup:**
1. Configure IMAP email settings
2. Set Google Drive folder ID
3. Configure email sending credentials

### 5. Weekly Summary Reporter

**File:** `5-weekly-summary-reporter.json`

**What it does:**
- Runs every Monday at 9 AM
- Finds all mind maps modified in the last week
- Generates comprehensive report
- Uses AI to analyze activity and provide insights
- Emails summary to team

**Setup:**
1. Set mind maps directory path
2. Configure email recipients
3. Customize report format

## Common Patterns

### Pattern 1: File Watcher → Process → Notify

```
[File Watcher] → [Read Mind Map] → [Process with MCP] → [Notification]
```

Use this for:
- Auto-expanding nodes on file change
- Validating mind map structure
- Triggering backups

### Pattern 2: Schedule → Search → Act

```
[Schedule Trigger] → [Search Nodes] → [AI Processing] → [Update Mind Map]
```

Use this for:
- Periodic research updates
- Scheduled summarization
- Batch processing

### Pattern 3: Webhook → Create/Update → Respond

```
[Webhook] → [MCP Tool Call] → [Format Response] → [Respond to Webhook]
```

Use this for:
- API integrations
- External system triggers
- Real-time collaboration

### Pattern 4: External Data → Transform → Mind Map

```
[Data Source] → [Transform] → [Create/Update Mind Map] → [Notify]
```

Use this for:
- CRM to mind map sync
- Project management integration
- Knowledge base import

## Example: Custom n8n Node Configuration

### HTTP Request Node for MCP Tool Call

```json
{
  "method": "POST",
  "url": "http://localhost:3000/mcp/call-tool",
  "authentication": "none",
  "jsonParameters": true,
  "body": {
    "tool": "expand_node_with_ai",
    "arguments": {
      "file_path": "={{$json[\"file_path\"]}}",
      "node_id": "={{$json[\"node_id\"]}}",
      "num_subtopics": 5
    }
  },
  "options": {
    "timeout": 30000
  }
}
```

### Function Node: Extract Node IDs from Mind Map

```javascript
// Extract all node IDs from mind map content
const content = items[0].json.content || '';
const idPattern = /ID_[A-Za-z0-9_]+/g;
const ids = content.match(idPattern) || [];

return ids.map(id => ({
  json: { nodeId: id }
}));
```

### Function Node: Format Mind Map as Markdown

```javascript
const content = items[0].json.content || '';

// Convert mind map outline to markdown
const lines = content.split('\n');
let markdown = '# Mind Map Summary\n\n';

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('- ')) {
    // Count indentation level
    const indent = (line.match(/^(\s*)/)[0].length) / 2;
    const prefix = '  '.repeat(Math.max(0, indent - 1));
    markdown += prefix + trimmed + '\n';
  }
}

return [{
  json: {
    markdown: markdown,
    originalContent: content
  }
}];
```

## Advanced Workflows

### Workflow: AI-Powered Mind Map Organizer

This workflow analyzes your mind map structure and suggests reorganization:

1. **Trigger:** Manual or scheduled
2. **Read mind map** using MCP
3. **Extract all nodes** into flat list
4. **Call Claude API** to analyze structure and suggest improvements
5. **Parse suggestions** into actionable changes
6. **Create new organized version** or update existing
7. **Generate comparison report**

### Workflow: Multi-Language Mind Map Translator

1. **Watch for new mind maps** in specific folder
2. **Read source mind map**
3. **Extract all text nodes**
4. **Call translation API** (or Claude) for each node
5. **Create translated version** maintaining structure
6. **Save with language suffix** (e.g., `map-es.mm`, `map-fr.mm`)

### Workflow: Mind Map to Notion Sync

1. **Schedule trigger** (e.g., every hour)
2. **Read mind map**
3. **Convert structure to Notion hierarchy**
4. **Create/update Notion pages** via API
5. **Maintain sync metadata** to track changes
6. **Handle bidirectional sync** if needed

## Debugging n8n Workflows

### Enable Verbose Logging

In HTTP Request nodes:
- Enable "Include Response Headers"
- Enable "Full Response"
- Check "Continue on Fail"

### Common Issues

**Issue:** "Connection refused to localhost:3000"
- **Solution:** Ensure MCP HTTP bridge is running
- Check: `curl http://localhost:3000/health`

**Issue:** "Tool execution timeout"
- **Solution:** Increase timeout in HTTP Request node options
- AI operations may take 10-30 seconds

**Issue:** "Node ID not found"
- **Solution:** Use `read_mindmap` first to verify node IDs
- Node IDs change when files are recreated

**Issue:** "Invalid XML" errors
- **Solution:** Ensure Freeplane files aren't being edited during processing
- Add file locking or retry logic

### Testing Workflows

1. **Use manual triggers** during development
2. **Add "Sticky Note" nodes** to document workflow logic
3. **Enable "Always Output Data"** on nodes for debugging
4. **Use "Edit Fields (Set)" nodes** to log intermediate values

## Best Practices

### 1. Error Handling

Always add error handling paths:

```
[HTTP Request] → [If Error] → [Notify Admin]
                ↓
                [Success Path]
```

### 2. Rate Limiting

For AI operations, add delays between batch processing:

```
[Loop] → [Wait 2s] → [AI Operation] → [Next Item]
```

### 3. File Locking

When updating mind maps, implement file locking:

```javascript
// In Function node
const lockFile = items[0].json.file_path + '.lock';

// Check if lock exists
if (await fs.exists(lockFile)) {
  throw new Error('File is locked, retry later');
}

// Create lock
await fs.writeFile(lockFile, Date.now().toString());

// ... perform operations ...

// Remove lock
await fs.unlink(lockFile);
```

### 4. Batch Processing

Process large mind maps in batches:

```
[Read Mind Map] → [Split In Batches (50)] → [Process] → [Merge Results]
```

### 5. Validation

Validate data before making changes:

```
[Read Input] → [Validate Schema] → [Transform] → [Update Mind Map]
                      ↓
                [Validation Failed] → [Log Error]
```

## Security Considerations

1. **API Keys:** Store in n8n credentials, never in workflow JSON
2. **File Paths:** Validate and sanitize all file paths
3. **Access Control:** Restrict webhook endpoints with authentication
4. **Rate Limiting:** Implement rate limiting for public webhooks
5. **Audit Logging:** Log all mind map modifications

## Performance Tips

1. **Cache mind map reads** if processing multiple nodes
2. **Use parallel processing** for independent operations
3. **Minimize file I/O** by batching updates
4. **Set appropriate timeouts** for AI operations
5. **Monitor memory usage** with large mind maps (1000+ nodes)

## Resources

- [n8n Documentation](https://docs.n8n.io/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)
- [Freeplane Scripting](https://docs.freeplane.org/scripting/)
- [Example Workflows Repository](./n8n-workflows/)

## Support

For issues with n8n integration:
1. Check the HTTP bridge is running: `curl http://localhost:3000/health`
2. Test MCP tools directly via bridge API
3. Review n8n execution logs
4. Check Freeplane file permissions

## Next Steps

1. **Start simple:** Import workflow #1 (Watch and Expand)
2. **Test with sample mind maps**
3. **Customize for your use case**
4. **Build your own workflows** using these patterns
5. **Share your creations** with the community!
