import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { readFile, writeFile } from 'fs/promises';
import type { FreeplaneMap, FreeplaneNode, NodePath } from './types.js';

const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseAttributeValue: false,
  trimValues: true,
  parseTagValue: false,
  processEntities: true,
  htmlEntities: true,
};

const builderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  indentBy: '  ',
  suppressEmptyNode: true,
};

export class FreeplaneParser {
  private parser: XMLParser;
  private builder: XMLBuilder;

  constructor() {
    this.parser = new XMLParser(parserOptions);
    this.builder = new XMLBuilder(builderOptions);
  }

  /**
   * Parse a Freeplane .mm file
   */
  async parseFile(filePath: string): Promise<FreeplaneMap> {
    const content = await readFile(filePath, 'utf-8');
    return this.parseString(content);
  }

  /**
   * Parse Freeplane XML string
   */
  parseString(xmlContent: string): FreeplaneMap {
    const parsed = this.parser.parse(xmlContent);
    return parsed as FreeplaneMap;
  }

  /**
   * Convert FreeplaneMap back to XML string
   */
  toString(map: FreeplaneMap): string {
    const xmlContent = this.builder.build(map);
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlContent;
  }

  /**
   * Save FreeplaneMap to file
   */
  async saveFile(filePath: string, map: FreeplaneMap): Promise<void> {
    const xmlContent = this.toString(map);
    await writeFile(filePath, xmlContent, 'utf-8');
  }

  /**
   * Find a node by ID
   */
  findNodeById(map: FreeplaneMap, nodeId: string): FreeplaneNode | null {
    return this.searchNode(map.map.node, nodeId);
  }

  private searchNode(node: FreeplaneNode, targetId: string): FreeplaneNode | null {
    if (node['@_ID'] === targetId) {
      return node;
    }

    if (node.node) {
      const children = Array.isArray(node.node) ? node.node : [node.node];
      for (const child of children) {
        const found = this.searchNode(child, targetId);
        if (found) return found;
      }
    }

    return null;
  }

  /**
   * Get all text content from a node and its children
   */
  getAllText(node: FreeplaneNode, maxDepth: number = 3, currentDepth: number = 0): string {
    let text = node['@_TEXT'] || '';

    if (currentDepth < maxDepth && node.node) {
      const children = Array.isArray(node.node) ? node.node : [node.node];
      const childTexts = children.map(child =>
        this.getAllText(child, maxDepth, currentDepth + 1)
      );
      if (childTexts.length > 0) {
        text += '\n' + childTexts.map(t => '  ' + t).join('\n');
      }
    }

    return text;
  }

  /**
   * Add a child node
   */
  addChildNode(
    parentNode: FreeplaneNode,
    text: string,
    attributes?: Record<string, string>
  ): FreeplaneNode {
    const newNode: FreeplaneNode = {
      '@_TEXT': text,
      '@_ID': this.generateId(),
      '@_CREATED': new Date().getTime().toString(),
      '@_MODIFIED': new Date().getTime().toString(),
      ...attributes,
    };

    if (!parentNode.node) {
      parentNode.node = newNode;
    } else if (Array.isArray(parentNode.node)) {
      parentNode.node.push(newNode);
    } else {
      parentNode.node = [parentNode.node, newNode];
    }

    return newNode;
  }

  /**
   * Generate a unique ID for a node
   */
  private generateId(): string {
    return 'ID_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  /**
   * Get node by path (array of indices)
   */
  getNodeByPath(map: FreeplaneMap, path: number[]): FreeplaneNode | null {
    let current: FreeplaneNode = map.map.node;

    for (const index of path) {
      if (!current.node) return null;
      const children = Array.isArray(current.node) ? current.node : [current.node];
      if (index >= children.length) return null;
      current = children[index];
    }

    return current;
  }

  /**
   * Convert map to readable text outline
   */
  toTextOutline(map: FreeplaneMap, maxDepth: number = 10): string {
    return this.nodeToTextOutline(map.map.node, 0, maxDepth);
  }

  private nodeToTextOutline(node: FreeplaneNode, depth: number, maxDepth: number): string {
    const indent = '  '.repeat(depth);
    let result = indent + '- ' + (node['@_TEXT'] || '[No text]') + '\n';

    if (depth < maxDepth && node.node) {
      const children = Array.isArray(node.node) ? node.node : [node.node];
      for (const child of children) {
        result += this.nodeToTextOutline(child, depth + 1, maxDepth);
      }
    }

    return result;
  }

  /**
   * Count total nodes in map
   */
  countNodes(node: FreeplaneNode): number {
    let count = 1;
    if (node.node) {
      const children = Array.isArray(node.node) ? node.node : [node.node];
      for (const child of children) {
        count += this.countNodes(child);
      }
    }
    return count;
  }

  /**
   * Update node text
   */
  updateNodeText(node: FreeplaneNode, newText: string): void {
    node['@_TEXT'] = newText;
    node['@_MODIFIED'] = new Date().getTime().toString();
  }

  /**
   * Remove all children from a node
   */
  removeChildren(node: FreeplaneNode): void {
    delete node.node;
    node['@_MODIFIED'] = new Date().getTime().toString();
  }
}
