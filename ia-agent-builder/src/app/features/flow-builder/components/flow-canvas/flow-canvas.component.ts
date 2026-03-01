import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild
} from '@angular/core';
import { DrawflowAdapterService } from '../../services/drawflow-adapter.service';

@Component({
  selector: 'app-flow-canvas',
  standalone: true,
  templateUrl: './flow-canvas.component.html',
  styleUrl: './flow-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlowCanvasComponent {
  private readonly drawflow = inject(DrawflowAdapterService);

  @ViewChild('drawflow', { static: true }) private readonly drawflowRef?: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    const el = this.drawflowRef?.nativeElement;
    if (!el) return;
    this.drawflow.init(el);
  }
}
