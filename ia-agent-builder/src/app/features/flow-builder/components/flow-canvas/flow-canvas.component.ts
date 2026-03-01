import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild
} from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NodeType } from '../../../../core/models/node-type';
import { DrawflowAdapterService } from '../../services/drawflow-adapter.service';
import { FlowDndService } from '../../services/flow-dnd.service';

export interface NodeDroppedEvent {
  type: NodeType;
  position: { x: number; y: number };
}

@Component({
  selector: 'app-flow-canvas',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './flow-canvas.component.html',
  styleUrl: './flow-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowCanvasComponent {
  private readonly drawflow = inject(DrawflowAdapterService);
  private readonly dnd = inject(FlowDndService);

  readonly dropEnabled = this.dnd.isDraggingFromPalette;

  @ViewChild('canvas', { static: true }) private readonly canvasRef?: ElementRef<HTMLElement>;
  @ViewChild('drawflow', { static: true }) private readonly drawflowRef?: ElementRef<HTMLElement>;

  @Output() readonly nodeDropped = new EventEmitter<NodeDroppedEvent>();

  readonly alwaysAllowDrop = () => true;

  ngAfterViewInit(): void {
    const el = this.drawflowRef?.nativeElement;
    if (!el) return;
    this.drawflow.init(el);
  }

  onDrop(event: CdkDragDrop<unknown>): void {
    const raw = event.item.data;
    if (typeof raw !== 'string') return;

    const type = raw as NodeType;
    const canvasEl = this.canvasRef?.nativeElement;
    if (!canvasEl) return;

    const rect = canvasEl.getBoundingClientRect();
    const point = this.getDropClientPoint(event);
    const x = point ? Math.max(0, Math.round(point.x - rect.left)) : Math.round(rect.width / 2);
    const y = point ? Math.max(0, Math.round(point.y - rect.top)) : Math.round(rect.height / 2);

    this.nodeDropped.emit({ type, position: { x, y } });
  }

  private getDropClientPoint(event: CdkDragDrop<unknown>): { x: number; y: number } | null {
    const e = event as unknown;

    if (
      typeof e === 'object' &&
      e !== null &&
      'dropPoint' in e &&
      typeof (e as { dropPoint?: unknown }).dropPoint === 'object' &&
      (e as { dropPoint?: { x?: unknown; y?: unknown } }).dropPoint !== null
    ) {
      const p = (e as { dropPoint: { x?: unknown; y?: unknown } }).dropPoint;
      if (typeof p.x === 'number' && typeof p.y === 'number') return { x: p.x, y: p.y };
    }

    if (
      typeof e === 'object' &&
      e !== null &&
      'pointerPosition' in e &&
      typeof (e as { pointerPosition?: unknown }).pointerPosition === 'object' &&
      (e as { pointerPosition?: { x?: unknown; y?: unknown } }).pointerPosition !== null
    ) {
      const p = (e as { pointerPosition: { x?: unknown; y?: unknown } }).pointerPosition;
      if (typeof p.x === 'number' && typeof p.y === 'number') return { x: p.x, y: p.y };
    }

    return null;
  }
}
