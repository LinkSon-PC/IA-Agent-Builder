import { NodeType } from './node-type';
import { NodeConfigSchema } from './node-config-schema';

/**
 * UI metadata for rendering node palettes.
 */
export interface NodeVisualDefinition {
  title: string;
  description: string;
  icon: string;
}

/**
 * Full node type definition used by registry/palette.
 */
export interface NodeTypeDefinition {
  type: NodeType;
  visual: NodeVisualDefinition;
  configSchema?: NodeConfigSchema;
}
