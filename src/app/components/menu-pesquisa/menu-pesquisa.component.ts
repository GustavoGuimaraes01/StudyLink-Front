import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import{MatSidenavModule} from  '@angular/material/sidenav' ;
import { MatListModule } from '@angular/material/list';
import { AgendadorComponent } from "../agendador/agendador.component";




@Component({
  selector: 'app-menu-pesquisa',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, AgendadorComponent],
  templateUrl: './menu-pesquisa.component.html',
  styleUrl: './menu-pesquisa.component.css'
})

export class MenuPesquisaComponent {

}
