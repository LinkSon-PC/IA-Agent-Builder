import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { NodeRegistryService } from '../../../../core/services/node-registry.service';
import { NodeTypeDefinition } from '../../../../core/models/node-definition';
import { FlowDndService } from '../../services/flow-dnd.service';

@Component({
  selector: 'app-node-palette',
  standalone: true,
  imports: [DragDropModule, CdkDrag, MatCardModule],
  templateUrl: './node-palette.component.html',
  styleUrl: './node-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodePaletteComponent {
  private readonly registry = inject(NodeRegistryService);
  private readonly dnd = inject(FlowDndService);

  /** Node types available for dragging into the canvas. */
  readonly nodeTypes = computed<readonly NodeTypeDefinition[]>(() => this.registry.getAvailableNodeTypes());

  onDragStarted(): void {
    this.dnd.startDrag();
  }

  onDragEnded(): void {
    this.dnd.endDrag();
  }
}
