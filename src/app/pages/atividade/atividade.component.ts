import { Component } from '@angular/core';
import { MenuPesquisaComponent } from "../../components/menu-pesquisa/menu-pesquisa.component";

@Component({
  selector: 'app-atividade',
  standalone: true,
  imports: [ MenuPesquisaComponent],
  templateUrl: './atividade.component.html',
  styleUrl: './atividade.component.css'
})
export class AtividadeComponent {

}
