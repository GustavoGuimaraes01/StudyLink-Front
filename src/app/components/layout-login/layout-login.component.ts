import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { setAlternateWeakRefImpl } from '@angular/core/primitives/signals';
import { Title } from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-layout-login',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './layout-login.component.html',
  styleUrl: './layout-login.component.css'
})
export class LayoutLoginComponent {
  @Input() titulo: string = "";
  @Input() btnText: string = "";
  @Input () imagem: string = "";
  @Input() btnlink: string = ""
  @Input() disableButton: boolean = false
  @Output("enviar") onEnviar = new EventEmitter();

  enviar(){
    this.onEnviar.emit();
  }

}
