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
  @Output() readonly nodePresetSelected = new EventEmitter<NodePalettePreset>();

  readonly presets: readonly NodePalettePreset[] = [
    { title: 'Agenda', description: 'Ruta final: agendaAgent', route: 'agendaAgent' },
    { title: 'Catalogo', description: 'Ruta final: catalogAgent', route: 'catalogAgent' },
    { title: 'FAQ', description: 'Ruta final: faqAgent', route: 'faqAgent' }
  ];

  /** Node types available for dragging into the canvas. */
  readonly nodeTypes = computed<readonly NodeTypeDefinition[]>(() => this.registry.getAvailableNodeTypes());

  selectType(type: NodeType): void {
    this.nodeTypeSelected.emit(type);
  }

  selectPreset(preset: NodePalettePreset): void {
    this.nodePresetSelected.emit(preset);
  }
}

export interface NodePalettePreset {
  title: string;
  description: string;
  route: string;
}
