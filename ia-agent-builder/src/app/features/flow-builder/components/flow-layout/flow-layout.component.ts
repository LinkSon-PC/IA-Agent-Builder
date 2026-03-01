import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlowCanvasComponent, NodeDroppedEvent } from '../flow-canvas/flow-canvas.component';
import { NodePaletteComponent } from '../node-palette/node-palette.component';

@Component({
  selector: 'app-flow-layout',
  standalone: true,
  imports: [DragDropModule, NodePaletteComponent, FlowCanvasComponent],
  templateUrl: './flow-layout.component.html',
  styleUrl: './flow-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowLayoutComponent {
  @Output() readonly nodeDropped = new EventEmitter<NodeDroppedEvent>();

  onNodeDropped(evt: NodeDroppedEvent): void {
    this.nodeDropped.emit(evt);
  }
}
