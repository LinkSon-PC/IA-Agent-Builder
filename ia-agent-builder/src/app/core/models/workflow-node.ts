import { NodeConfigSchema } from './node-config-schema';
import { NodeInput, NodeOutput } from './node-io';
import { NodeState } from './node-state';
import { NodeStatus } from './node-status';
import { NodeType } from './node-type';

/**
 * Base properties shared by all workflow node types.
 */
export interface WorkflowNodeBase<TType extends NodeType, TConfig> {
  /** Node id (Drawflow id). */
  id: string;

  /** Node type discriminator. */
  type: TType;

  /** Display name (title on canvas). */
  name: string;

  /** Canvas position. */
  x: number;
  y: number;

  /** Editable enable/disable status in the builder. */
  status: NodeStatus;

  /** Execution state updated by the engine. */
  state: NodeState;

  /** Node config (edited by dynamic form). */
  config: TConfig;

  /** Optional config schema for UI rendering. */
  configSchema?: NodeConfigSchema;

  /** Whether this node has editable configuration. */
  hasConfig: boolean;

  /** Input ports. */
  inputs: NodeInput[];

  /** Output ports. */
  outputs: NodeOutput[];
}

export interface MessageNodeConfig {
  text: string;
}

export type MessageWorkflowNode = WorkflowNodeBase<NodeType.Message, MessageNodeConfig>;

export interface QuestionNodeConfig {
  prompt: string;
  variableName: string;
}

export type QuestionWorkflowNode = WorkflowNodeBase<NodeType.Question, QuestionNodeConfig>;

export interface DecisionNodeConfig {
  expression: string;
}

export type DecisionWorkflowNode = WorkflowNodeBase<NodeType.Decision, DecisionNodeConfig>;

export interface CoordinatorNodeConfig {
  agentName: string;
  basePrompt: string;
}

export type CoordinatorWorkflowNode = WorkflowNodeBase<NodeType.Coordinator, CoordinatorNodeConfig>;

export interface CustomRouteNodeConfig {
  title: string;
  route: string;
}

export type CustomRouteWorkflowNode = WorkflowNodeBase<NodeType.CustomRoute, CustomRouteNodeConfig>;

export type AnyWorkflowNode =
  | MessageWorkflowNode
  | QuestionWorkflowNode
  | DecisionWorkflowNode
  | CoordinatorWorkflowNode
  | CustomRouteWorkflowNode;
