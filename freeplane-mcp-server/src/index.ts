#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { FreeplaneParser } from './freeplane-parser.js';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';

const FREEPLANE_TOOLS: Tool[] = [
  {
    name: 'read_mindmap',
    description: 'Read and parse a Freeplane .mm mind map file. Returns the structure as a text outline.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Absolute path to the .mm file',
        },
        max_depth: {
          type: 'number',
          description: 'Maximum depth to display (default: 10)',
          default: 10,
        },
      },
      required: ['file_path'],
    },
  },
  {
    name: 'get_node_content',
    description: 'Get detailed content of a specific node by ID or path',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to the .mm file',
        },
        node_id: {
          type: 'string',
          description: 'Node ID to retrieve (optional if using path)',
        },
        path: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of indices representing path to node (optional if using node_id)',
        },
        include_children: {
          type: 'boolean',
          description: 'Include child nodes in output',
          default: true,
        },
      },
      required: ['file_path'],
    },
  },
  {
    name: 'expand_node_with_ai',
    description: 'Use AI to generate and add child nodes to expand on a topic. Requires ANTHROPIC_API_KEY environment variable.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to the .mm file',
        },
        node_id: {
          type: 'string',
          description: 'ID of node to expand',
        },
        prompt: {
          type: 'string',
          description: 'Additional context or instructions for expansion',
        },
        num_subtopics: {
          type: 'number',
          description: 'Number of subtopics to generate (default: 5)',
          default: 5,
        },
      },
      required: ['file_path', 'node_id'],
    },
  },
  {
    name: 'summarize_branch',
    description: 'Use AI to create a summary of a node branch and its children',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to the .mm file',
        },
        node_id: {
          type: 'string',
          description: 'ID of root node to summarize',
        },
        max_depth: {
          type: 'number',
          description: 'Maximum depth to include in summary (default: 3)',
          default: 3,
        },
      },
      required: ['file_path', 'node_id'],
    },
  },
  {
    name: 'add_child_nodes',
    description: 'Add one or more child nodes to a parent node',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to the .mm file',
        },
        parent_node_id: {
          type: 'string',
          description: 'ID of parent node',
        },
        children: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              attributes: { type: 'object' },
            },
            required: ['text'],
          },
          description: 'Array of child nodes to add',
        },
      },
      required: ['file_path', 'parent_node_id', 'children'],
    },
  },
  {
    name: 'update_node',
    description: 'Update the text content of a node',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to the .mm file',
        },
        node_id: {
          type: 'string',
          description: 'ID of node to update',
        },
        new_text: {
          type: 'string',
          description: 'New text content for the node',
        },
      },
      required: ['file_path', 'node_id', 'new_text'],
    },
  },
  {
    name: 'search_nodes',
    description: 'Search for nodes containing specific text',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to the .mm file',
        },
        search_text: {
          type: 'string',
          description: 'Text to search for',
        },
        case_sensitive: {
          type: 'boolean',
          description: 'Case sensitive search',
          default: false,
        },
      },
      required: ['file_path', 'search_text'],
    },
  },
  {
    name: 'create_mindmap',
    description: 'Create a new Freeplane mind map file',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path where the new .mm file should be created',
        },
        root_text: {
          type: 'string',
          description: 'Text for the root node',
        },
        initial_children: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional array of initial child node texts',
        },
      },
      required: ['file_path', 'root_text'],
    },
  },
];

class FreeplaneServer {
  private server: Server;
  private parser: FreeplaneParser;
  private anthropic: Anthropic | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'freeplane-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.parser = new FreeplaneParser();

    // Initialize Anthropic client if API key is available
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey) {
      this.anthropic = new Anthropic({ apiKey });
    }

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: FREEPLANE_TOOLS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'read_mindmap':
            return await this.handleReadMindmap(args);
          case 'get_node_content':
            return await this.handleGetNodeContent(args);
          case 'expand_node_with_ai':
            return await this.handleExpandNodeWithAI(args);
          case 'summarize_branch':
            return await this.handleSummarizeBranch(args);
          case 'add_child_nodes':
            return await this.handleAddChildNodes(args);
          case 'update_node':
            return await this.handleUpdateNode(args);
          case 'search_nodes':
            return await this.handleSearchNodes(args);
          case 'create_mindmap':
            return await this.handleCreateMindmap(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${errorMessage}` }],
          isError: true,
        };
      }
    });
  }

  private async handleReadMindmap(args: any) {
    const map = await this.parser.parseFile(args.file_path);
    const outline = this.parser.toTextOutline(map, args.max_depth || 10);
    const nodeCount = this.parser.countNodes(map.map.node);

    return {
      content: [
        {
          type: 'text',
          text: `Mind Map: ${args.file_path}\nTotal Nodes: ${nodeCount}\n\n${outline}`,
        },
      ],
    };
  }

  private async handleGetNodeContent(args: any) {
    const map = await this.parser.parseFile(args.file_path);
    let node;

    if (args.node_id) {
      node = this.parser.findNodeById(map, args.node_id);
    } else if (args.path) {
      node = this.parser.getNodeByPath(map, args.path);
    } else {
      node = map.map.node;
    }

    if (!node) {
      throw new Error('Node not found');
    }

    const text = args.include_children
      ? this.parser.getAllText(node, 3)
      : node['@_TEXT'] || '[No text]';

    return {
      content: [
        {
          type: 'text',
          text: `Node ID: ${node['@_ID'] || 'root'}\nText: ${text}`,
        },
      ],
    };
  }

  private async handleExpandNodeWithAI(args: any) {
    if (!this.anthropic) {
      throw new Error('ANTHROPIC_API_KEY environment variable not set');
    }

    const map = await this.parser.parseFile(args.file_path);
    const node = this.parser.findNodeById(map, args.node_id);

    if (!node) {
      throw new Error('Node not found');
    }

    const nodeText = node['@_TEXT'] || '';
    const context = this.parser.getAllText(map.map.node, 2);

    const prompt = `Given this mind map topic: "${nodeText}"

Context from the mind map:
${context}

${args.prompt ? `Additional instructions: ${args.prompt}` : ''}

Generate ${args.num_subtopics || 5} specific, actionable subtopics to expand on this topic. Return ONLY a JSON array of strings, nothing else.

Example format: ["Subtopic 1", "Subtopic 2", "Subtopic 3"]`;

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    const subtopics = JSON.parse(content.text);

    // Add subtopics as child nodes
    for (const subtopic of subtopics) {
      this.parser.addChildNode(node, subtopic);
    }

    await this.parser.saveFile(args.file_path, map);

    return {
      content: [
        {
          type: 'text',
          text: `Successfully added ${subtopics.length} child nodes to "${nodeText}":\n${subtopics.map((s: string) => `- ${s}`).join('\n')}`,
        },
      ],
    };
  }

  private async handleSummarizeBranch(args: any) {
    if (!this.anthropic) {
      throw new Error('ANTHROPIC_API_KEY environment variable not set');
    }

    const map = await this.parser.parseFile(args.file_path);
    const node = this.parser.findNodeById(map, args.node_id);

    if (!node) {
      throw new Error('Node not found');
    }

    const branchText = this.parser.getAllText(node, args.max_depth || 3);

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Summarize this mind map branch in 2-3 paragraphs:\n\n${branchText}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI');
    }

    return {
      content: [
        {
          type: 'text',
          text: `Summary of branch "${node['@_TEXT']}":\n\n${content.text}`,
        },
      ],
    };
  }

  private async handleAddChildNodes(args: any) {
    const map = await this.parser.parseFile(args.file_path);
    const parentNode = this.parser.findNodeById(map, args.parent_node_id);

    if (!parentNode) {
      throw new Error('Parent node not found');
    }

    const addedNodes = [];
    for (const child of args.children) {
      this.parser.addChildNode(parentNode, child.text, child.attributes);
      addedNodes.push(child.text);
    }

    await this.parser.saveFile(args.file_path, map);

    return {
      content: [
        {
          type: 'text',
          text: `Successfully added ${addedNodes.length} child nodes:\n${addedNodes.map((n: string) => `- ${n}`).join('\n')}`,
        },
      ],
    };
  }

  private async handleUpdateNode(args: any) {
    const map = await this.parser.parseFile(args.file_path);
    const node = this.parser.findNodeById(map, args.node_id);

    if (!node) {
      throw new Error('Node not found');
    }

    const oldText = node['@_TEXT'] || '[No text]';
    this.parser.updateNodeText(node, args.new_text);
    await this.parser.saveFile(args.file_path, map);

    return {
      content: [
        {
          type: 'text',
          text: `Updated node:\nOld: "${oldText}"\nNew: "${args.new_text}"`,
        },
      ],
    };
  }

  private async handleSearchNodes(args: any) {
    const map = await this.parser.parseFile(args.file_path);
    const results: Array<{ id: string; text: string }> = [];

    const searchInNode = (node: any) => {
      const text = node['@_TEXT'] || '';
      const searchText = args.case_sensitive ? args.search_text : args.search_text.toLowerCase();
      const nodeText = args.case_sensitive ? text : text.toLowerCase();

      if (nodeText.includes(searchText)) {
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

    return {
      content: [
        {
          type: 'text',
          text: `Found ${results.length} nodes:\n${results.map(r => `- [${r.id}] ${r.text}`).join('\n')}`,
        },
      ],
    };
  }

  private async handleCreateMindmap(args: any) {
    const newMap: any = {
      map: {
        '@_version': 'freeplane 1.11.0',
        node: {
          '@_TEXT': args.root_text,
          '@_ID': 'ID_ROOT_' + Date.now(),
          '@_CREATED': new Date().getTime().toString(),
          '@_MODIFIED': new Date().getTime().toString(),
        },
      },
    };

    if (args.initial_children && args.initial_children.length > 0) {
      const children = args.initial_children.map((text: string) => ({
        '@_TEXT': text,
        '@_ID': `ID_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        '@_CREATED': new Date().getTime().toString(),
        '@_MODIFIED': new Date().getTime().toString(),
      }));
      newMap.map.node.node = children;
    }

    await this.parser.saveFile(args.file_path, newMap);

    return {
      content: [
        {
          type: 'text',
          text: `Created new mind map at ${args.file_path} with root node "${args.root_text}"`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Freeplane MCP Server running on stdio');
  }
}

const server = new FreeplaneServer();
server.run().catch(console.error);
