import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importando Router
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AgendadorComponent } from "../agendador/agendador.component";
import { NavigationEnd } from '@angular/router'; // Importando NavigationEnd
import { filter } from 'rxjs/operators'; // Importando filter

@Component({
  selector: 'app-menu-pesquisa',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, AgendadorComponent],
  templateUrl: './menu-pesquisa.component.html',
  styleUrls: ['./menu-pesquisa.component.css'] // Corrigido para styleUrls
})
export class MenuPesquisaComponent implements OnInit {
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Escutar eventos de navegação
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url; // Atualiza a rota atual
    });
  }
}
