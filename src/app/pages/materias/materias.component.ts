import { Component } from '@angular/core';
import { MenuPesquisaComponent } from '../../components/menu-pesquisa/menu-pesquisa.component';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [MenuPesquisaComponent],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css',
})
export class MateriasComponent {

}
