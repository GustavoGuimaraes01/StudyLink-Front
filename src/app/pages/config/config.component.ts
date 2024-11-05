import { Component } from '@angular/core';
import { AgendadorComponent } from "../../components/agendador/agendador.component";
import { MenuPesquisaComponent } from "../../components/menu-pesquisa/menu-pesquisa.component";

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [AgendadorComponent, MenuPesquisaComponent],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {

}
