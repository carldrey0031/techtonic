/**
 * MCP HTTP Bridge Server
 *
 * Provides an HTTP REST API endpoint for the Freeplane MCP Server
 * This allows n8n and other HTTP-based tools to interact with the MCP server
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

let mcpProcess = null;
let isReady = false;

// Initialize MCP server process
function initMCP() {
  const mcpServerPath = path.join(__dirname, 'freeplane-mcp-server', 'dist', 'index.js');

  mcpProcess = spawn('node', [mcpServerPath], {
    env: {
      ...process.env,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || ''
    },
    stdio: ['pipe', 'pipe', 'inherit']
  });

  mcpProcess.on('error', (error) => {
    console.error('Failed to start MCP server:', error);
    isReady = false;
  });

  mcpProcess.on('exit', (code) => {
    console.log(`MCP server exited with code ${code}`);
    isReady = false;
  });

  // Wait for server to be ready
  setTimeout(() => {
    isReady = true;
    console.log('MCP Server initialized');
  }, 2000);
}

// Simplified HTTP-based tool calling
// In a production setup, you'd implement proper MCP protocol communication
// For now, this is a conceptual bridge - you may need to adapt based on your actual MCP implementation

app.post('/mcp/call-tool', async (req, res) => {
  try {
    if (!isReady) {
      return res.status(503).json({
        error: 'MCP server not ready',
        message: 'Please wait a few seconds and try again'
      });
    }

    const { tool, arguments: args } = req.body;

    if (!tool) {
      return res.status(400).json({
        error: 'Missing required field: tool'
      });
    }

    // Note: This is a simplified implementation
    // In production, implement proper stdin/stdout communication with MCP server
    // For now, return a mock response structure

    const mockResponse = {
      content: [
        {
          type: 'text',
          text: `Tool ${tool} would be called with arguments: ${JSON.stringify(args, null, 2)}`
        }
      ],
      isError: false
    };

    res.json(mockResponse);

  } catch (error) {
    console.error('Error calling tool:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Alternative: Direct file-based operations (bypassing MCP for simplicity)
app.post('/api/mindmap/read', async (req, res) => {
  try {
    const { FreeplaneParser } = await import('./freeplane-mcp-server/dist/freeplane-parser.js');
    const parser = new FreeplaneParser();

    const { file_path, max_depth = 10 } = req.body;

    if (!file_path) {
      return res.status(400).json({ error: 'file_path is required' });
    }

    const map = await parser.parseFile(file_path);
    const outline = parser.toTextOutline(map, max_depth);
    const nodeCount = parser.countNodes(map.map.node);

    res.json({
      success: true,
      file_path,
      node_count: nodeCount,
      outline,
      map
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/mindmap/create', async (req, res) => {
  try {
    const { FreeplaneParser } = await import('./freeplane-mcp-server/dist/freeplane-parser.js');
    const parser = new FreeplaneParser();

    const { file_path, root_text, initial_children = [] } = req.body;

    if (!file_path || !root_text) {
      return res.status(400).json({ error: 'file_path and root_text are required' });
    }

    const newMap = {
      map: {
        '@_version': 'freeplane 1.11.0',
        node: {
          '@_TEXT': root_text,
          '@_ID': 'ID_ROOT_' + Date.now(),
          '@_CREATED': new Date().getTime().toString(),
          '@_MODIFIED': new Date().getTime().toString(),
        },
      },
    };

    if (initial_children.length > 0) {
      const children = initial_children.map((text) => ({
        '@_TEXT': text,
        '@_ID': `ID_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        '@_CREATED': new Date().getTime().toString(),
        '@_MODIFIED': new Date().getTime().toString(),
      }));
      newMap.map.node.node = children;
    }

    await parser.saveFile(file_path, newMap);

    res.json({
      success: true,
      message: `Created mind map at ${file_path}`,
      file_path,
      root_node_id: newMap.map.node['@_ID']
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/mindmap/expand-with-ai', async (req, res) => {
  try {
    const { FreeplaneParser } = await import('./freeplane-mcp-server/dist/freeplane-parser.js');
    const Anthropic = (await import('@anthropic-ai/sdk')).default;

    const parser = new FreeplaneParser();
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const { file_path, node_id, prompt, num_subtopics = 5 } = req.body;

    if (!file_path || !node_id) {
      return res.status(400).json({ error: 'file_path and node_id are required' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
    }

    const map = await parser.parseFile(file_path);
    const node = parser.findNodeById(map, node_id);

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    const nodeText = node['@_TEXT'] || '';
    const context = parser.getAllText(map.map.node, 2);

    const aiPrompt = `Given this mind map topic: "${nodeText}"

Context from the mind map:
${context}

${prompt ? `Additional instructions: ${prompt}` : ''}

Generate ${num_subtopics} specific, actionable subtopics to expand on this topic. Return ONLY a JSON array of strings, nothing else.

Example format: ["Subtopic 1", "Subtopic 2", "Subtopic 3"]`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{ role: 'user', content: aiPrompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    const subtopics = JSON.parse(content.text);

    // Add subtopics as child nodes
    for (const subtopic of subtopics) {
      parser.addChildNode(node, subtopic);
    }

    await parser.saveFile(file_path, map);

    res.json({
      success: true,
      message: `Successfully added ${subtopics.length} child nodes`,
      node_text: nodeText,
      subtopics
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/mindmap/add-children', async (req, res) => {
  try {
    const { FreeplaneParser } = await import('./freeplane-mcp-server/dist/freeplane-parser.js');
    const parser = new FreeplaneParser();

    const { file_path, parent_node_id, children } = req.body;

    if (!file_path || !parent_node_id || !children) {
      return res.status(400).json({
        error: 'file_path, parent_node_id, and children are required'
      });
    }

    const map = await parser.parseFile(file_path);
    const parentNode = parser.findNodeById(map, parent_node_id);

    if (!parentNode) {
      return res.status(404).json({ error: 'Parent node not found' });
    }

    const addedNodes = [];
    for (const child of children) {
      parser.addChildNode(parentNode, child.text, child.attributes);
      addedNodes.push(child.text);
    }

    await parser.saveFile(file_path, map);

    res.json({
      success: true,
      message: `Added ${addedNodes.length} child nodes`,
      children: addedNodes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/mindmap/search', async (req, res) => {
  try {
    const { FreeplaneParser } = await import('./freeplane-mcp-server/dist/freeplane-parser.js');
    const parser = new FreeplaneParser();

    const { file_path, search_text, case_sensitive = false } = req.body;

    if (!file_path || !search_text) {
      return res.status(400).json({
        error: 'file_path and search_text are required'
      });
    }

    const map = await parser.parseFile(file_path);
    const results = [];

    const searchInNode = (node) => {
      const text = node['@_TEXT'] || '';
      const searchStr = case_sensitive ? search_text : search_text.toLowerCase();
      const nodeText = case_sensitive ? text : text.toLowerCase();

      if (nodeText.includes(searchStr)) {
        results.push({
          id: node['@_ID'] || 'root',
          text: text,
        });
      }

      if (node.node) {
        const children = Array.isArray(node.node) ? node.node : [node.node];
        children.forEach(searchInNode);
      }
    };

    searchInNode(map.map.node);

    res.json({
      success: true,
      count: results.length,
      results
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List available tools
app.get('/mcp/tools', (req, res) => {
  res.json({
    tools: [
      'read_mindmap',
      'get_node_content',
      'expand_node_with_ai',
      'summarize_branch',
      'add_child_nodes',
      'update_node',
      'search_nodes',
      'create_mindmap'
    ]
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mcpReady: isReady,
    anthropicConfigured: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Freeplane MCP HTTP Bridge',
    version: '1.0.0',
    endpoints: {
      'POST /mcp/call-tool': 'Call MCP tool (conceptual)',
      'POST /api/mindmap/read': 'Read mind map file',
      'POST /api/mindmap/create': 'Create new mind map',
      'POST /api/mindmap/expand-with-ai': 'Expand node with AI',
      'POST /api/mindmap/add-children': 'Add child nodes',
      'POST /api/mindmap/search': 'Search nodes',
      'GET /mcp/tools': 'List available tools',
      'GET /health': 'Health check'
    },
    documentation: 'See README.md and N8N_INTEGRATION_GUIDE.md'
  });
});

const PORT = process.env.PORT || 3000;

// Initialize and start
initMCP();

app.listen(PORT, () => {
  console.log(`\n🚀 Freeplane MCP HTTP Bridge running on http://localhost:${PORT}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /mcp/tools - List tools`);
  console.log(`   POST /api/mindmap/read - Read mind map`);
  console.log(`   POST /api/mindmap/create - Create mind map`);
  console.log(`   POST /api/mindmap/expand-with-ai - AI expansion`);
  console.log(`   POST /api/mindmap/add-children - Add nodes`);
  console.log(`   POST /api/mindmap/search - Search nodes`);
  console.log(`\n💡 Set ANTHROPIC_API_KEY environment variable for AI features\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  if (mcpProcess) {
    mcpProcess.kill();
  }
  process.exit(0);
});
