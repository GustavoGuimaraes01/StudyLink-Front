import { Component } from '@angular/core';
import { LayoutLoginComponent } from '../../components/layout-login/layout-login.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [LayoutLoginComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
}
