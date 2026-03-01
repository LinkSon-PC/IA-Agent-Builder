import { APP_INITIALIZER, Provider } from '@angular/core';
import { NodeExecutionRegistryService } from './node-execution-registry.service';
import { HttpNodeExecutionService } from './strategies/http-node-execution.service';
import { TransformNodeExecutionService } from './strategies/transform-node-execution.service';

/**
 * Registers built-in execution strategies.
 */
export const WORKFLOW_EXECUTION_PROVIDERS: Provider[] = [
  {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [NodeExecutionRegistryService, TransformNodeExecutionService, HttpNodeExecutionService],
    useFactory: (
      registry: NodeExecutionRegistryService,
      transform: TransformNodeExecutionService,
      http: HttpNodeExecutionService
    ) => {
      return () => {
        registry.register(transform);
        registry.register(http);
      };
    }
  }
];
