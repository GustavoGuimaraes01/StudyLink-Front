import { Component, Input, input } from '@angular/core';
import { setAlternateWeakRefImpl } from '@angular/core/primitives/signals';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-layout-login',
  standalone: true,
  imports: [],
  templateUrl: './layout-login.component.html',
  styleUrl: './layout-login.component.css'
})
export class LayoutLoginComponent {
  @Input() titulo: string = "";
  @Input() btnText: string = "";
  @Input () imagem: string = "";

}
