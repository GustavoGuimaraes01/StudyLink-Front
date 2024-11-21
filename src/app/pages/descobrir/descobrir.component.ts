import { Component } from '@angular/core';
import { MenuPesquisaComponent } from "../../components/menu-pesquisa/menu-pesquisa.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-descobrir',
  standalone: true,
  imports: [MenuPesquisaComponent, CommonModule],
  templateUrl: './descobrir.component.html',
  styleUrl: './descobrir.component.css'
})
export class DescobrirComponent {

}
