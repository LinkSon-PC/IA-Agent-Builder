import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import Drawflow, { DrawflowConnectionEvent, DrawflowExport } from 'drawflow';
import { NodeState } from '../../../core/models/node-state';
import { NodeStatus } from '../../../core/models/node-status';

export type DrawflowEditorMode = 'edit' | 'fixed';

export interface DrawflowNodeCreatedEvent {
  nodeId: string;
}

export interface DrawflowNodeRemovedEvent {
  nodeId: string;
}

export interface DrawflowConnectionCreatedEvent {
  connection: DrawflowConnectionEvent;
}

export interface DrawflowConnectionRemovedEvent {
  connection: DrawflowConnectionEvent;
}

export interface DrawflowNodeSelectedEvent {
  nodeId: string;
}

@Injectable({ providedIn: 'root' })
export class DrawflowAdapterService {
  private editor?: Drawflow;
  private container?: HTMLElement;

  private readonly nodeCreatedSubject = new Subject<DrawflowNodeCreatedEvent>();
  private readonly nodeRemovedSubject = new Subject<DrawflowNodeRemovedEvent>();
  private readonly connectionCreatedSubject = new Subject<DrawflowConnectionCreatedEvent>();
  private readonly connectionRemovedSubject = new Subject<DrawflowConnectionRemovedEvent>();
  private readonly nodeSelectedSubject = new Subject<DrawflowNodeSelectedEvent>();

  readonly nodeCreated$: Observable<DrawflowNodeCreatedEvent> = this.nodeCreatedSubject.asObservable();
  readonly nodeRemoved$: Observable<DrawflowNodeRemovedEvent> = this.nodeRemovedSubject.asObservable();
  readonly connectionCreated$: Observable<DrawflowConnectionCreatedEvent> =
    this.connectionCreatedSubject.asObservable();
  readonly connectionRemoved$: Observable<DrawflowConnectionRemovedEvent> =
    this.connectionRemovedSubject.asObservable();
  readonly nodeSelected$: Observable<DrawflowNodeSelectedEvent> = this.nodeSelectedSubject.asObservable();

  init(container: HTMLElement): void {
    this.destroy();

    const editor = new Drawflow(container);
    editor.editor_mode = 'edit';

    editor.on('nodeCreated', (id) => {
      const nodeId = typeof id === 'string' ? id : String(id);
      this.nodeCreatedSubject.next({ nodeId });
    });

    editor.on('nodeRemoved', (id) => {
      const nodeId = typeof id === 'string' ? id : String(id);
      this.nodeRemovedSubject.next({ nodeId });
    });

    editor.on('connectionCreated', (connection) => {
      this.connectionCreatedSubject.next({ connection: connection as DrawflowConnectionEvent });
    });

    editor.on('connectionRemoved', (connection) => {
      this.connectionRemovedSubject.next({ connection: connection as DrawflowConnectionEvent });
    });

    editor.on('nodeSelected', (id) => {
      const nodeId = typeof id === 'string' ? id : String(id);
      this.nodeSelectedSubject.next({ nodeId });
    });

    editor.start();
    this.editor = editor;
    this.container = container;
  }

  destroy(): void {
    if (this.editor) {
      this.editor.clear();
      this.editor = undefined;
    }
    this.container = undefined;
  }

  setMode(mode: DrawflowEditorMode): void {
    if (!this.editor) return;
    this.editor.editor_mode = mode;
  }

  exportJson(): DrawflowExport {
    if (!this.editor) {
      return { drawflow: {} };
    }
    return this.editor.export();
  }

  importJson(data: DrawflowExport): void {
    if (!this.editor) return;
    this.editor.import(data);
  }

  addSimpleNode(name: string, posX: number, posY: number): string {
    if (!this.editor) {
      return '';
    }

    const html = `
      <div class="flow-node-content">
        <div class="flow-node-title">${name}</div>
        <div class="flow-node-badge" aria-hidden="true">Disabled</div>
      </div>
    `;

    const id = this.editor.addNode(name, 1, 1, posX, posY, 'flow-node', {}, html);
    return String(id);
  }

  /** Applies runtime state styling to a Drawflow node element via CSS classes. */
  setNodeCssState(nodeId: string, state: NodeState): void {
    const container = this.container;
    if (!container) return;

    const el = container.querySelector<HTMLElement>(`#node-${nodeId}`);
    if (!el) return;

    el.classList.remove('node-state-idle', 'node-state-running', 'node-state-success', 'node-state-error');
    el.classList.add(`node-state-${state}`);
  }

  /** Applies editable status styling (enabled/disabled) via CSS classes. */
  setNodeCssStatus(nodeId: string, status: NodeStatus): void {
    const container = this.container;
    if (!container) return;

    const el = container.querySelector<HTMLElement>(`#node-${nodeId}`);
    if (!el) return;

    el.classList.remove('node-status-enabled', 'node-status-disabled');
    el.classList.add(`node-status-${status}`);

    const editor = this.editor;
    if (!editor) return;

    const numericId = Number(nodeId);
    const candidates: Array<string | number> = [nodeId, `node-${nodeId}`];
    if (!Number.isNaN(numericId)) {
      candidates.unshift(numericId);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const id of candidates) {
          editor.updateConnectionNodes(id);
        }
      });
    });
  }

  setNodeTitle(nodeId: string, title: string): void {
    const container = this.container;
    if (!container) return;

    const el = container.querySelector<HTMLElement>(`#node-${nodeId}`);
    if (!el) return;

    const titleEl = el.querySelector<HTMLElement>('.flow-node-title');
    if (!titleEl) return;
    titleEl.textContent = title;
  }
}
