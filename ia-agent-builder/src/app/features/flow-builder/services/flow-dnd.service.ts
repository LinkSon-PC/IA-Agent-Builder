import { Injectable, NgZone, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlowDndService {
  private readonly _isDraggingFromPalette = signal(false);
  readonly isDraggingFromPalette = this._isDraggingFromPalette.asReadonly();

  private readonly _dragSessionId = signal(0);
  readonly dragSessionId = this._dragSessionId.asReadonly();

  private readonly zone = inject(NgZone);

  constructor() {
    // Defensive cleanup: if drag-end doesn't fire (or fires late), ensure we don't
    // leave an overlay active that blocks Drawflow pointer interactions.
    window.addEventListener(
      'pointerup',
      () => {
        this.zone.run(() => this.endDrag());
      },
      { capture: true }
    );
    window.addEventListener(
      'pointercancel',
      () => {
        this.zone.run(() => this.endDrag());
      },
      { capture: true }
    );
    window.addEventListener(
      'mouseup',
      () => {
        this.zone.run(() => this.endDrag());
      },
      { capture: true }
    );
    window.addEventListener(
      'touchend',
      () => {
        this.zone.run(() => this.endDrag());
      },
      { capture: true }
    );
    window.addEventListener('blur', () => {
      this.zone.run(() => this.endDrag());
    });
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') {
        this.zone.run(() => this.endDrag());
      }
    });
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') this.zone.run(() => this.endDrag());
    });
  }

  startDrag(): void {
    this._dragSessionId.update((v) => v + 1);
    this._isDraggingFromPalette.set(true);
  }

  endDrag(): void {
    this._isDraggingFromPalette.set(false);
  }
}
