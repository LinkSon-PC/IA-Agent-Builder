import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WorkflowStoreService } from '../../workflow/store/workflow-store.service';
import { NodeFactoryService } from '../../../core/services/node-factory.service';
import { NodeRegistryService } from '../../../core/services/node-registry.service';
import { FlowLayoutComponent } from '../components/flow-layout/flow-layout.component';
import { NodeConfigHostComponent } from '../components/node-config-host/node-config-host.component';
import { NodeDroppedEvent } from '../components/flow-canvas/flow-canvas.component';
import { Workflow } from '../../../core/models/workflow';
import { DrawflowAdapterService } from '../services/drawflow-adapter.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkflowConnection } from '../../../core/models/workflow-connection';

@Component({
  selector: 'app-flow-builder-page',
  standalone: true,
  imports: [FlowLayoutComponent, MatCardModule, NodeConfigHostComponent],
  templateUrl: './flow-builder-page.component.html',
  styleUrl: './flow-builder-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowBuilderPageComponent {
  private readonly store = inject(WorkflowStoreService);
  private readonly nodeFactory = inject(NodeFactoryService);
  private readonly nodeRegistry = inject(NodeRegistryService);
  private readonly drawflow = inject(DrawflowAdapterService);

  constructor() {
    // Ensure there is always an active workflow in demo mode.
    if (!this.store.activeWorkflow()) {
      const now = new Date().toISOString();
      const wf: Workflow = {
        id: 'demo-workflow',
        name: 'Demo Workflow',
        createdAtIso: now,
        updatedAtIso: now,
        startNodeId: '',
        nodes: [],
        connections: []
      };
      this.store.setActiveWorkflow(wf);
    }

    // Keep selection stable when workflow changes.
    effect(() => {
      const wf = this.store.activeWorkflow();
      const selected = this.store.selectedNodeId();
      if (!wf || !selected) return;
      const exists = wf.nodes.some((n) => n.id === selected);
      if (!exists) this.store.selectNode(null);
    });

    this.drawflow.connectionCreated$.pipe(takeUntilDestroyed()).subscribe(({ connection }) => {
      const fromNodeId = connection.output_id;
      const toNodeId = connection.input_id;
      if (!fromNodeId || !toNodeId) return;

      const wf = this.store.activeWorkflow();
      if (!wf) return;
      const exists = wf.connections.some((c) => c.fromNodeId === fromNodeId && c.toNodeId === toNodeId);
      if (exists) return;

      const edge: WorkflowConnection = { fromNodeId, toNodeId };
      this.store.addConnection(edge);
    });

    this.drawflow.connectionRemoved$.pipe(takeUntilDestroyed()).subscribe(({ connection }) => {
      const fromNodeId = connection.output_id;
      const toNodeId = connection.input_id;
      if (!fromNodeId || !toNodeId) return;
      this.store.removeConnection(fromNodeId, toNodeId);
    });

    this.drawflow.nodeRemoved$.pipe(takeUntilDestroyed()).subscribe(({ nodeId }) => {
      this.store.removeConnectionsForNode(nodeId);
    });

    this.drawflow.nodeSelected$.pipe(takeUntilDestroyed()).subscribe(({ nodeId }) => {
      this.store.selectNode(nodeId);
    });

    effect(() => {
      const nodes = this.store.nodes();
      for (const n of nodes) {
        this.drawflow.setNodeCssStatus(n.id, n.status);
        this.drawflow.setNodeCssState(n.id, n.state);
      }
    });
  }

  onNodeDropped(evt: NodeDroppedEvent): void {
    const wf = this.store.activeWorkflow();
    if (!wf) return;

    const def = this.nodeRegistry.getDefinition(evt.type);
    const title = def?.visual.title ?? String(evt.type);

    const nodeId = this.drawflow.addSimpleNode(title, evt.position.x, evt.position.y);
    if (!nodeId) return;
    const node = this.nodeFactory.create(evt.type, {
      id: nodeId,
      name: title,
      x: evt.position.x,
      y: evt.position.y
    });

    const nodes = [...wf.nodes, node];
    const startNodeId = wf.startNodeId || node.id;

    this.store.setActiveWorkflow({
      ...wf,
      nodes,
      startNodeId,
      updatedAtIso: new Date().toISOString()
    });

    this.store.selectNode(node.id);
  }
}
