import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']  // Corrigido para styleUrls
})
export class AlertsComponent {
  @Input() message: string = '';           // Mensagem a ser exibida
  @Input() type: string = 'error';         // Tipo do alerta (error, success, info, warning)
  @Output() close = new EventEmitter<void>(); // Evento emitido quando o alerta for fechado

  constructor() { }

  onClose() {
    this.close.emit();  // Emitir evento quando o alerta for fechado
  }
}
