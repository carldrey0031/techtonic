# Freeplane MCP Server - Setup Guide

## ✅ Server Built Successfully!

The MCP server has been compiled and is ready to use.

**Server Location**: `/home/user/techtonic/freeplane-mcp-server/dist/index.js`

## 🔧 Configure Claude Desktop

You need to update your Claude Desktop MCP configuration to point to the correct server path.

### Step 1: Locate Claude Desktop Config

The config file location depends on your OS:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Step 2: Update Configuration

Open `claude_desktop_config.json` and replace the placeholder path with the actual path:

```json
{
  "mcpServers": {
    "freeplane": {
      "command": "node",
      "args": ["/home/user/techtonic/freeplane-mcp-server/dist/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "your-actual-api-key-here"
      }
    }
  }
}
```

**Important**: Replace `your-actual-api-key-here` with your actual Anthropic API key.

### Step 3: Restart Claude Desktop

After updating the config:
1. Completely quit Claude Desktop (not just close the window)
2. Relaunch Claude Desktop
3. The Freeplane MCP server should now be available

## 🧪 Test the Server

Once configured, you can test it in Claude Desktop by asking:

```
"Create a new mind map at /tmp/test.mm with the root topic 'Project Planning'"
```

Or:

```
"Read the mind map at /path/to/your/map.mm"
```

## 🔑 Get Your Anthropic API Key

If you don't have an API key:

1. Visit https://console.anthropic.com/
2. Sign in or create an account
3. Go to API Keys section
4. Create a new API key
5. Copy it and add to the config above

## 🐛 Troubleshooting

### Server Not Found Error

If you still get the error, check:

1. **Path is correct**: Make sure the path in config matches the server location exactly
2. **Node.js is installed**: Run `node --version` (should be 18+)
3. **Server is built**: Check that `/home/user/techtonic/freeplane-mcp-server/dist/index.js` exists

### Permission Errors

Run:
```bash
chmod +x /home/user/techtonic/freeplane-mcp-server/dist/index.js
```

### API Key Not Working

- Make sure there are no extra spaces
- Ensure the key starts with `sk-ant-`
- Check the key is active in Anthropic Console

## 📝 Example Configuration Files

### Minimal Config (No API Key - Limited Features)

```json
{
  "mcpServers": {
    "freeplane": {
      "command": "node",
      "args": ["/home/user/techtonic/freeplane-mcp-server/dist/index.js"]
    }
  }
}
```

This will work for basic operations (read, create, search) but AI features (expand, summarize) will not work without the API key.

### Full Config with API Key

```json
{
  "mcpServers": {
    "freeplane": {
      "command": "node",
      "args": ["/home/user/techtonic/freeplane-mcp-server/dist/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-api03-your-key-here"
      }
    }
  }
}
```

## 🚀 Alternative: Use the HTTP Bridge

If you prefer not to configure Claude Desktop MCP, you can use the HTTP bridge instead:

```bash
cd /home/user/techtonic
export ANTHROPIC_API_KEY="your-key"
npm install express @anthropic-ai/sdk
node mcp-http-bridge.js
```

Then use the REST API at `http://localhost:3000` with n8n or other tools.

## ✅ Verification Checklist

- [ ] MCP server is built (dist/index.js exists)
- [ ] Node.js 18+ is installed
- [ ] Claude Desktop config is updated with correct path
- [ ] API key is added to config (if using AI features)
- [ ] Claude Desktop has been restarted
- [ ] Test with a simple mind map operation

## 📚 Next Steps

Once configured:
- See [FREEPLANE_AI_INTEGRATION.md](../FREEPLANE_AI_INTEGRATION.md) for usage examples
- Explore [n8n-workflows](../n8n-workflows/) for automation
- Read [N8N_INTEGRATION_GUIDE.md](../N8N_INTEGRATION_GUIDE.md) for n8n setup

## 💬 Still Having Issues?

Common problems:

1. **"Cannot find module" error**: Path in config doesn't match actual location
2. **"ANTHROPIC_API_KEY not set" error**: API key not in config or incorrect
3. **Server disconnects immediately**: Check Node.js version (needs 18+)
4. **No tools showing in Claude**: Config syntax error (validate JSON)

Need more help? Check the error logs in Claude Desktop or open an issue on GitHub.
