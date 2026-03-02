import { Injectable } from '@angular/core';
import { Workflow } from '../../../core/models/workflow';

@Injectable({ providedIn: 'root' })
export class WorkflowLocalStorageService {
  private readonly storageKey = 'ia-agent-builder.workflow.active.v1';

  load(): Workflow | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as Workflow;
    } catch {
      return null;
    }
  }

  save(workflow: Workflow): void {
    localStorage.setItem(this.storageKey, JSON.stringify(workflow));
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
