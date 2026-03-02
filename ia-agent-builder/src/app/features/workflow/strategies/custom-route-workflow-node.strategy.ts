import { NodeType } from '../../../core/models/node-type';
import { CustomRouteWorkflowNode } from '../../../core/models/workflow-node';
import { NodeStrategy } from '../../../core/services/node-registry.service';

export class CustomRouteWorkflowNodeStrategy
  implements NodeStrategy<CustomRouteWorkflowNode, { title: string; route: string }>
{
  readonly type = NodeType.CustomRoute;

  getDefaultConfig(): { title: string; route: string } {
    return { title: '', route: '' };
  }

  validate(node: CustomRouteWorkflowNode): readonly string[] {
    const errors: string[] = [];
    if (!node.config.title.trim()) errors.push('El título es requerido.');
    if (!node.config.route.trim()) errors.push('La ruta es requerida.');
    return errors;
  }
}
