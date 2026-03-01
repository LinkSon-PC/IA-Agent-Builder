import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { WorkflowStoreService } from '../../../workflow/store/workflow-store.service';
import { NodeConfigFormComponent } from '../node-config-form/node-config-form.component';

@Component({
  selector: 'app-node-config-host',
  standalone: true,
  imports: [MatCardModule, NodeConfigFormComponent],
  templateUrl: './node-config-host.component.html',
  styleUrl: './node-config-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeConfigHostComponent {
  private readonly store = inject(WorkflowStoreService);

  /** Selected node resolved from the store. */
  readonly selectedNode = this.store.selectedNode;

  /** Whether the selected node has editable config. */
  readonly showForm = computed(() => {
    const node = this.selectedNode();
    return !!node && node.hasConfig;
  });
}
