# Freeplane MCP Server

AI-powered Model Context Protocol (MCP) server for Freeplane mind mapping integration. This server provides tools for reading, writing, and AI-enhanced manipulation of Freeplane mind maps.

## Features

- **Read & Parse** Freeplane `.mm` files
- **AI-Powered Expansion** - Automatically generate subtopics using Claude
- **Smart Summarization** - Create summaries of mind map branches
- **Node Management** - Add, update, search nodes programmatically
- **Full CRUD Operations** - Create new mind maps, update existing ones
- **n8n Integration Ready** - Works seamlessly with n8n automation workflows

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key (for AI features)

### Setup

1. **Clone and Install**

```bash
cd freeplane-mcp-server
npm install
```

2. **Build the Server**

```bash
npm run build
```

3. **Set Environment Variables**

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

4. **Configure Claude Desktop** (optional)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "freeplane": {
      "command": "node",
      "args": ["/path/to/freeplane-mcp-server/dist/index.js"],
      "env": {
        "ANTHROPIC_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

### 1. `read_mindmap`

Read and parse a Freeplane mind map file.

**Parameters:**
- `file_path` (string, required): Absolute path to the .mm file
- `max_depth` (number, optional): Maximum depth to display (default: 10)

**Example:**
```json
{
  "tool": "read_mindmap",
  "arguments": {
    "file_path": "/path/to/mymap.mm",
    "max_depth": 5
  }
}
```

### 2. `get_node_content`

Get detailed content of a specific node.

**Parameters:**
- `file_path` (string, required): Path to the .mm file
- `node_id` (string, optional): Node ID to retrieve
- `path` (array, optional): Array of indices representing path to node
- `include_children` (boolean, optional): Include child nodes (default: true)

### 3. `expand_node_with_ai`

Use AI to generate and add child nodes to expand on a topic.

**Parameters:**
- `file_path` (string, required): Path to the .mm file
- `node_id` (string, required): ID of node to expand
- `prompt` (string, optional): Additional context or instructions
- `num_subtopics` (number, optional): Number of subtopics to generate (default: 5)

**Example:**
```json
{
  "tool": "expand_node_with_ai",
  "arguments": {
    "file_path": "/path/to/mymap.mm",
    "node_id": "ID_123456789",
    "prompt": "Focus on technical implementation details",
    "num_subtopics": 7
  }
}
```

### 4. `summarize_branch`

Create an AI-generated summary of a node branch.

**Parameters:**
- `file_path` (string, required): Path to the .mm file
- `node_id` (string, required): ID of root node to summarize
- `max_depth` (number, optional): Maximum depth to include (default: 3)

### 5. `add_child_nodes`

Add one or more child nodes to a parent node.

**Parameters:**
- `file_path` (string, required): Path to the .mm file
- `parent_node_id` (string, required): ID of parent node
- `children` (array, required): Array of child node objects with `text` and optional `attributes`

**Example:**
```json
{
  "tool": "add_child_nodes",
  "arguments": {
    "file_path": "/path/to/mymap.mm",
    "parent_node_id": "ID_123456789",
    "children": [
      { "text": "First subtopic" },
      { "text": "Second subtopic", "attributes": { "@_COLOR": "#FF0000" } }
    ]
  }
}
```

### 6. `update_node`

Update the text content of a node.

**Parameters:**
- `file_path` (string, required): Path to the .mm file
- `node_id` (string, required): ID of node to update
- `new_text` (string, required): New text content

### 7. `search_nodes`

Search for nodes containing specific text.

**Parameters:**
- `file_path` (string, required): Path to the .mm file
- `search_text` (string, required): Text to search for
- `case_sensitive` (boolean, optional): Case sensitive search (default: false)

### 8. `create_mindmap`

Create a new Freeplane mind map file.

**Parameters:**
- `file_path` (string, required): Path where the new .mm file should be created
- `root_text` (string, required): Text for the root node
- `initial_children` (array, optional): Array of initial child node texts

**Example:**
```json
{
  "tool": "create_mindmap",
  "arguments": {
    "file_path": "/path/to/new-map.mm",
    "root_text": "Project Planning",
    "initial_children": ["Research", "Design", "Development", "Testing"]
  }
}
```

## Usage Examples

### Using with Claude Desktop

Once configured, you can interact with Freeplane mind maps directly in Claude conversations:

```
User: Read the mind map at /Users/me/Documents/project.mm

Claude: I'll read that mind map for you.
[Claude uses the read_mindmap tool]

User: Expand the "Marketing Strategy" node with 5 creative ideas

Claude: I'll expand that node with AI-generated ideas.
[Claude uses search_nodes to find the node, then expand_node_with_ai]
```

### Using with n8n

See the `n8n-workflows/` directory for pre-built workflow examples. Import them into n8n and configure the HTTP Request nodes to point to your MCP server endpoint.

### Programmatic Usage

```typescript
import { FreeplaneParser } from './freeplane-parser.js';

const parser = new FreeplaneParser();

// Read a mind map
const map = await parser.parseFile('/path/to/map.mm');

// Get text outline
const outline = parser.toTextOutline(map);
console.log(outline);

// Add a child node
const rootNode = map.map.node;
parser.addChildNode(rootNode, 'New Topic');

// Save changes
await parser.saveFile('/path/to/map.mm', map);
```

## Integration Patterns

### 1. Automated Expansion

Set up file watchers to automatically expand nodes marked with special tags like `[EXPAND]` or `[AI]`.

### 2. Research Assistant

Schedule periodic checks for nodes marked with `[RESEARCH]`, then automatically search the web and populate with findings.

### 3. Meeting Notes to Mind Map

Convert meeting transcripts or notes into structured mind maps automatically.

### 4. Knowledge Base Sync

Keep mind maps synchronized with external knowledge bases, wikis, or documentation systems.

### 5. Team Collaboration

Use webhooks to create and update mind maps based on team activities (commits, tickets, messages).

## Architecture

```
freeplane-mcp-server/
├── src/
│   ├── index.ts           # Main MCP server implementation
│   ├── freeplane-parser.ts # XML parsing and manipulation
│   └── types.ts           # TypeScript type definitions
├── dist/                  # Compiled JavaScript
├── package.json
└── tsconfig.json
```

### Key Components

- **FreeplaneParser**: Handles XML parsing, node manipulation, and file I/O
- **MCP Server**: Exposes tools via Model Context Protocol
- **AI Integration**: Uses Anthropic Claude for intelligent operations

## Development

### Running in Development Mode

```bash
npm run dev
```

This starts TypeScript in watch mode, automatically recompiling on changes.

### Testing Locally

```bash
# Start the server
node dist/index.js

# In another terminal, test with Claude Desktop or send MCP requests
```

### Adding New Tools

1. Add tool definition to `FREEPLANE_TOOLS` array in `src/index.ts`
2. Implement handler method in `FreeplaneServer` class
3. Add to switch statement in `CallToolRequestSchema` handler
4. Rebuild: `npm run build`

## Troubleshooting

### "ANTHROPIC_API_KEY not set" Error

Make sure to set the environment variable:
```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Or add it to your MCP server configuration.

### XML Parsing Errors

Freeplane files must be valid XML. If you encounter parsing errors:
- Verify the file is not corrupted
- Check that it's a genuine `.mm` file from Freeplane
- Try opening in Freeplane to validate structure

### Node Not Found

Ensure you're using the correct node ID. Use `read_mindmap` or `search_nodes` to find valid node IDs.

## API Reference

See [API.md](./API.md) for detailed API documentation.

## Examples

See [EXAMPLES.md](./EXAMPLES.md) for more usage examples and patterns.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

MIT

## Related Projects

- [Freeplane](https://www.freeplane.org/) - Free mind mapping and knowledge management software
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol for AI-application integration
- [n8n](https://n8n.io/) - Workflow automation tool

## Support

For issues and questions:
- GitHub Issues: [Your repo URL]
- Documentation: [Your docs URL]
- Freeplane Docs: https://docs.freeplane.org/