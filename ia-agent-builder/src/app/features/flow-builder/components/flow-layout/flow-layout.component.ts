import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FlowCanvasComponent } from '../flow-canvas/flow-canvas.component';
import { NodePaletteComponent } from '../node-palette/node-palette.component';
import { NodeType } from '../../../../core/models/node-type';

@Component({
  selector: 'app-flow-layout',
  standalone: true,
  imports: [NodePaletteComponent, FlowCanvasComponent],
  templateUrl: './flow-layout.component.html',
  styleUrl: './flow-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowLayoutComponent {
  @Output() readonly nodeTypeSelected = new EventEmitter<NodeType>();

  onNodeTypeSelected(type: NodeType): void {
    this.nodeTypeSelected.emit(type);
  }
}
