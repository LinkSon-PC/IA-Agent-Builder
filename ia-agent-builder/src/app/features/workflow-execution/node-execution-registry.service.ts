import { Injectable } from '@angular/core';
import { NodeType } from '../../core/models/node-type';
import { AnyWorkflowNode } from '../../core/models/workflow-node';
import { NodeExecutionStrategy } from './node-execution-strategy';

/**
 * Registry responsible for mapping node types to their execution strategies.
 *
 * SOLID:
 * - Open/Closed: register new strategies without changing the engine.
 * - Single Responsibility: registry only stores and resolves mappings.
 */
@Injectable({ providedIn: 'root' })
export class NodeExecutionRegistryService {
  private readonly strategies = new Map<NodeType, NodeExecutionStrategy<AnyWorkflowNode>>();

  /** Registers an execution strategy for a specific node type. */
  register(strategy: NodeExecutionStrategy<AnyWorkflowNode>): void {
    this.strategies.set(strategy.type, strategy);
  }

  /** Resolves the execution strategy for a given node type. */
  get(type: NodeType): NodeExecutionStrategy<AnyWorkflowNode> | undefined {
    return this.strategies.get(type);
  }
}
