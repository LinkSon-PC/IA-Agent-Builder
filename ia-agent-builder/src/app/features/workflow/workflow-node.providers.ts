import { APP_INITIALIZER, Provider } from '@angular/core';
import { InputType } from '../../core/models/input-type';
import { NodeType } from '../../core/models/node-type';
import { NodeTypeDefinition } from '../../core/models/node-definition';
import { NodeRegistryService } from '../../core/services/node-registry.service';
import { CoordinatorWorkflowNodeStrategy } from './strategies/coordinator-workflow-node.strategy';
import { MessageWorkflowNodeStrategy } from './strategies/message-workflow-node.strategy';
import { QuestionWorkflowNodeStrategy } from './strategies/question-workflow-node.strategy';

/**
 * Registers built-in workflow node definitions + strategies.
 *
 * Restored as a placeholder during reconstruction. It will be populated again once
 * domain models and strategies are recreated.
 */
export const WORKFLOW_NODE_PROVIDERS: Provider[] = [
  {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [NodeRegistryService],
    useFactory: (registry: NodeRegistryService) => {
      return () => {
        const messageDef: NodeTypeDefinition = {
          type: NodeType.Message,
          visual: { title: 'Message', description: 'Emite un mensaje del asistente.', icon: 'chat' },
          configSchema: {
            fields: [
              {
                key: 'text',
                label: 'Texto',
                inputType: InputType.Text,
                required: true,
                placeholder: 'Escribe el mensaje...'
              }
            ]
          }
        };
        registry.registerNode(messageDef, new MessageWorkflowNodeStrategy());

        const questionDef: NodeTypeDefinition = {
          type: NodeType.Question,
          visual: {
            title: 'Question',
            description: 'Pregunta al usuario y guarda una variable.',
            icon: 'help'
          },
          configSchema: {
            fields: [
              {
                key: 'prompt',
                label: 'Prompt',
                inputType: InputType.Text,
                required: true,
                placeholder: '¿Cuál es tu nombre?'
              },
              {
                key: 'variableName',
                label: 'Nombre de variable',
                inputType: InputType.Text,
                required: true,
                placeholder: 'userName'
              }
            ]
          }
        };
        registry.registerNode(questionDef, new QuestionWorkflowNodeStrategy());

        const coordinatorDef: NodeTypeDefinition = {
          type: NodeType.Coordinator,
          visual: {
            title: 'Coordinator',
            description: 'Coordina múltiples agentes (patrón Coordinador).',
            icon: 'hub'
          },
          configSchema: {
            fields: [
              {
                key: 'basePrompt',
                label: 'Base prompt',
                inputType: InputType.Text,
                required: true,
                placeholder: 'Instrucciones de coordinación...'
              }
            ]
          }
        };
        registry.registerNode(coordinatorDef, new CoordinatorWorkflowNodeStrategy());
      };
    }
  }
];
