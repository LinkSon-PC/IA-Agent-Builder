import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { WORKFLOW_NODE_PROVIDERS } from './features/workflow/workflow-node.providers';
import { WORKFLOW_EXECUTION_PROVIDERS } from './features/workflow-execution/workflow-execution.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    ...WORKFLOW_NODE_PROVIDERS,
    ...WORKFLOW_EXECUTION_PROVIDERS
  ]
};
