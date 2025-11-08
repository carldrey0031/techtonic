/**
 * Freeplane .mm file format types
 * Based on Freeplane XML schema
 */

export interface FreeplaneMap {
  map: {
    '@_version': string;
    node: FreeplaneNode;
    attribute_registry?: AttributeRegistry;
  };
}

export interface FreeplaneNode {
  '@_TEXT'?: string;
  '@_ID'?: string;
  '@_POSITION'?: 'left' | 'right';
  '@_FOLDED'?: 'true' | 'false';
  '@_CREATED'?: string;
  '@_MODIFIED'?: string;
  '@_LINK'?: string;
  '@_COLOR'?: string;
  '@_BACKGROUND_COLOR'?: string;
  '@_STYLE'?: string;
  node?: FreeplaneNode | FreeplaneNode[];
  richcontent?: RichContent | RichContent[];
  attribute?: NodeAttribute | NodeAttribute[];
  icon?: Icon | Icon[];
  cloud?: Cloud;
  edge?: Edge;
  font?: Font;
  hook?: Hook | Hook[];
  arrowlink?: ArrowLink | ArrowLink[];
}

export interface RichContent {
  '@_TYPE': 'NODE' | 'NOTE' | 'DETAILS';
  html?: {
    head?: any;
    body?: any;
  };
}

export interface NodeAttribute {
  '@_NAME': string;
  '@_VALUE': string;
  '@_OBJECT'?: string;
}

export interface Icon {
  '@_BUILTIN': string;
}

export interface Cloud {
  '@_COLOR'?: string;
  '@_SHAPE'?: string;
}

export interface Edge {
  '@_COLOR'?: string;
  '@_STYLE'?: string;
  '@_WIDTH'?: string;
}

export interface Font {
  '@_NAME'?: string;
  '@_SIZE'?: string;
  '@_BOLD'?: 'true' | 'false';
  '@_ITALIC'?: 'true' | 'false';
}

export interface Hook {
  '@_NAME': string;
  '@_URI'?: string;
  parameters?: any;
}

export interface ArrowLink {
  '@_DESTINATION': string;
  '@_STARTARROW'?: string;
  '@_ENDARROW'?: string;
}

export interface AttributeRegistry {
  attribute_name?: {
    '@_NAME': string;
    '@_VISIBLE': 'true' | 'false';
  }[];
}

export interface NodePath {
  nodeId?: string;
  path?: number[];
}

export interface AIExpandRequest {
  nodeText: string;
  context?: string;
  depth?: number;
}

export interface AIExpandResponse {
  subtopics: string[];
  details?: Record<string, string>;
}
