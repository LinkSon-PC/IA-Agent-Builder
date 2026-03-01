import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlowDndService {
  private readonly _isDraggingFromPalette = signal(false);
  readonly isDraggingFromPalette = this._isDraggingFromPalette.asReadonly();

  startDrag(): void {
    this._isDraggingFromPalette.set(true);
  }

  endDrag(): void {
    this._isDraggingFromPalette.set(false);
  }
}
