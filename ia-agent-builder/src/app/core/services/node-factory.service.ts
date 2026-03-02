import { Injectable } from '@angular/core';
import { NodeState } from '../models/node-state';
import { NodeStatus } from '../models/node-status';
import { NodeType } from '../models/node-type';
import {
  AgentRouteFinalWorkflowNode,
  AnyWorkflowNode,
  CoordinatorWorkflowNode,
  CustomRouteWorkflowNode,
  DecisionWorkflowNode,
  MessageWorkflowNode,
  QuestionWorkflowNode
} from '../models/workflow-node';
import { NodeRegistryService } from './node-registry.service';

export interface CreateNodeOverrides {
  id: string;
  name: string;
  x: number;
  y: number;
}

/**
 * Creates new workflow nodes with safe defaults.
 */
@Injectable({ providedIn: 'root' })
export class NodeFactoryService {
  constructor(private readonly registry: NodeRegistryService) {}

  create(type: NodeType, overrides: CreateNodeOverrides): AnyWorkflowNode {
    const def = this.registry.getDefinition(type);
    const strategy = this.registry.getStrategy(type);

    const baseCommon = {
      id: overrides.id,
      name: overrides.name,
      x: overrides.x,
      y: overrides.y,
      status: 'enabled' as NodeStatus,
      state: 'idle' as NodeState,
      hasConfig: !!def?.configSchema,
      configSchema: def?.configSchema,
      inputs: [{ id: 'in-1', label: 'In' }],
      outputs: [{ id: 'out-1', label: 'Out' }]
    };

    switch (type) {
      case NodeType.Message: {
        const config = (strategy?.getDefaultConfig() as { text: string } | undefined) ?? { text: '' };
        const node: MessageWorkflowNode = { ...baseCommon, type: NodeType.Message, config };
        return node;
      }
      case NodeType.Question: {
        const config =
          (strategy?.getDefaultConfig() as { prompt: string; variableName: string } | undefined) ??
          ({ prompt: '', variableName: '' } as const);
        const node: QuestionWorkflowNode = { ...baseCommon, type: NodeType.Question, config };
        return node;
      }
      case NodeType.Decision: {
        const config = (strategy?.getDefaultConfig() as { expression: string } | undefined) ?? {
          expression: ''
        };
        const node: DecisionWorkflowNode = { ...baseCommon, type: NodeType.Decision, config };
        return node;
      }
      case NodeType.Coordinator: {
        const config =
          (strategy?.getDefaultConfig() as { agentName: string; basePrompt: string } | undefined) ??
          ({ agentName: '', basePrompt: '' } as const);
        const node: CoordinatorWorkflowNode = { ...baseCommon, type: NodeType.Coordinator, config };
        return node;
      }
      case NodeType.CustomRoute: {
        const config =
          (strategy?.getDefaultConfig() as { title: string; route: string } | undefined) ??
          ({ title: '', route: '' } as const);
        const node: CustomRouteWorkflowNode = { ...baseCommon, type: NodeType.CustomRoute, config };
        if (!node.config.title.trim()) {
          node.config = { ...node.config, title: overrides.name };
        }
        return node;
      }
      case NodeType.AgentRouteFinal: {
        const config = { route: '' };
        const node: AgentRouteFinalWorkflowNode = {
          ...baseCommon,
          type: NodeType.AgentRouteFinal,
          hasConfig: false,
          configSchema: undefined,
          outputs: [],
          config
        };
        return node;
      }
    }
  }
}
