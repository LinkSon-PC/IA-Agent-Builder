import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NodeRegistryService } from '../../../../core/services/node-registry.service';
import { NodeTypeDefinition } from '../../../../core/models/node-definition';
import { NodeType } from '../../../../core/models/node-type';

@Component({
  selector: 'app-node-palette',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './node-palette.component.html',
  styleUrl: './node-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodePaletteComponent {
  private readonly registry = inject(NodeRegistryService);

  @Output() readonly nodeTypeSelected = new EventEmitter<NodeType>();

  /** Node types available for dragging into the canvas. */
  readonly nodeTypes = computed<readonly NodeTypeDefinition[]>(() => this.registry.getAvailableNodeTypes());

  selectType(type: NodeType): void {
    this.nodeTypeSelected.emit(type);
  }
}
