import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AgendadorComponent } from "../agendador/agendador.component";
import { NavigationEnd } from '@angular/router'; 
import { filter } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-pesquisa',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, AgendadorComponent, CommonModule],
  templateUrl: './menu-pesquisa.component.html',
  styleUrls: ['./menu-pesquisa.component.css'] 

})
export class MenuPesquisaComponent implements OnInit {
  currentRoute: string = '';
  isMinimized: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = (event as NavigationEnd).url;
    });
  }

  toggleSidenav() {
    this.isMinimized = !this.isMinimized;
  }
}
