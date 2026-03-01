import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AnyWorkflowNode } from '../../../../core/models/workflow-node';
import { InputType } from '../../../../core/models/input-type';
import { NodeConfigField } from '../../../../core/models/node-config-schema';
import { NodeStatus } from '../../../../core/models/node-status';
import { WorkflowStoreService } from '../../../workflow/store/workflow-store.service';

type ConfigControl = FormControl<string>;
type ConfigForm = FormGroup<Record<string, ConfigControl>>;

@Component({
  selector: 'app-node-config-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonToggleModule, MatFormFieldModule, MatInputModule],
  templateUrl: './node-config-form.component.html',
  styleUrl: './node-config-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeConfigFormComponent {
  private readonly store = inject(WorkflowStoreService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Selected node from store. */
  readonly node = this.store.selectedNode;

  /** Config schema fields. */
  readonly fields = computed<readonly NodeConfigField[]>(() => this.node()?.configSchema?.fields ?? []);

  readonly statusControl = new FormControl<NodeStatus>('enabled', { nonNullable: true });

  form: ConfigForm = new FormGroup<Record<string, ConfigControl>>({});

  constructor() {
    effect(() => {
      const node = this.node();
      const fields = node?.configSchema?.fields ?? [];

      const group: Record<string, ConfigControl> = {};
      for (const f of fields) {
        const raw = (node?.config as unknown as Record<string, unknown> | undefined)?.[f.key];
        const value = typeof raw === 'string' ? raw : '';
        group[f.key] = new FormControl<string>(value, {
          nonNullable: true,
          validators: f.required ? [Validators.required] : []
        });
      }

      this.form = new FormGroup(group);

      const status = node?.status ?? 'enabled';
      this.statusControl.setValue(status, { emitEvent: false });

      this.cdr.markForCheck();
    });

    this.statusControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((status) => {
      const node = this.node();
      if (!node) return;
      this.store.updateNodeStatus(node.id, status);
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      const node = this.node();
      if (!node) return;
      this.store.updateNodeData(node.id, this.form.getRawValue());
    });
  }

  setStatusChange(evt: MatButtonToggleChange): void {
    const value = evt.value;
    if (value === 'enabled' || value === 'disabled') {
      this.statusControl.setValue(value);
    }
  }

  isText(f: NodeConfigField): boolean {
    return f.inputType === InputType.Text;
  }
}
