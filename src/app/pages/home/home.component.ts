import { Component } from '@angular/core';
import { MenuPesquisaComponent } from '../../components/menu-pesquisa/menu-pesquisa.component';
import { AgendadorComponent } from '../../components/agendador/agendador.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuPesquisaComponent, AgendadorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { }
