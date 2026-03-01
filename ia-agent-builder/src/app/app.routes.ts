import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/app-shell/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'builder'
      },
      {
        path: 'builder',
        loadComponent: () =>
          import('./features/flow-builder/pages/flow-builder-page.component').then(
            (m) => m.FlowBuilderPageComponent
          )
      },
      {
        path: 'simulator',
        loadComponent: () =>
          import('./features/chatbot-simulator/pages/chatbot-simulator-page.component').then(
            (m) => m.ChatbotSimulatorPageComponent
          )
      }
    ]
  }
];
