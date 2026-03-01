import { Injectable } from '@angular/core';
import { NodeTypeDefinition } from '../models/node-definition';
import { NodeType } from '../models/node-type';
import { AnyWorkflowNode } from '../models/workflow-node';

/**
 * Base strategy contract for node behaviors.
 *
 * In this reconstruction, strategies are primarily used to:
 * - Provide default config.
 * - Validate config.
 */
export interface NodeStrategy<TNode extends AnyWorkflowNode, TConfig> {
  readonly type: TNode['type'];

  /** Returns default config for new nodes. */
  getDefaultConfig(): TConfig;

  /** Validates node config. Returns error messages (empty array means valid). */
  validate(node: TNode): readonly string[];
}

/**
 * Registry for node type definitions (UI/palette) and their domain strategies.
 */
@Injectable({ providedIn: 'root' })
export class NodeRegistryService {
  private readonly definitions = new Map<NodeType, NodeTypeDefinition>();
  private readonly strategies = new Map<NodeType, NodeStrategy<AnyWorkflowNode, unknown>>();

  /** Registers a node definition and its strategy. */
  registerNode<TNode extends AnyWorkflowNode, TConfig>(
    definition: NodeTypeDefinition,
    strategy: NodeStrategy<TNode, TConfig>
  ): void {
    this.definitions.set(definition.type, definition);
    this.strategies.set(definition.type, strategy as NodeStrategy<AnyWorkflowNode, unknown>);
  }

  /** Returns a definition for a node type. */
  getDefinition(type: NodeType): NodeTypeDefinition | undefined {
    return this.definitions.get(type);
  }

  /** Returns available node types for palette rendering. */
  getAvailableNodeTypes(): readonly NodeTypeDefinition[] {
    return [...this.definitions.values()].sort((a, b) => a.visual.title.localeCompare(b.visual.title));
  }

  /** Returns strategy for a given node type. */
  getStrategy(type: NodeType): NodeStrategy<AnyWorkflowNode, unknown> | undefined {
    return this.strategies.get(type);
  }
}
