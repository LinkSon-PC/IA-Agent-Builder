import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chatbot-simulator-page',
  standalone: true,
  template: '<p>Simulator (reconstrucción en progreso)</p>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotSimulatorPageComponent {}
