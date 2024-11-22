import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AgendadorComponent } from "../agendador/agendador.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-pesquisa',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    AgendadorComponent,
    CommonModule
  ],
  templateUrl: './menu-pesquisa.component.html',
  styleUrls: ['./menu-pesquisa.component.css']
})
export class MenuPesquisaComponent implements OnInit {
  isMinimized: boolean = false;
  nomeUsuario: string = ""; 
  isMenuOpen: boolean = false;  
  email: string = '';  
  isSearchHidden = true; 
  isSearchExpanded = false; 

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSearch() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      if (this.isSearchExpanded) {
        this.isSearchExpanded = false; // Recolhe a pesquisa
        setTimeout(() => {
          this.isSearchHidden = true; // Esconde a pesquisa após a transição
        }, 300);
      } else {
        this.isSearchHidden = false; // Exibe a pesquisa
        setTimeout(() => {
          this.isSearchExpanded = true; // Expande a pesquisa
        }, 10);
      }
    }
  }

  ngOnInit() {
    // Recupera informações do usuário
    const emailSalvo = sessionStorage.getItem("email");
    this.email = emailSalvo ? emailSalvo : 'não cadastrado';

    const nomeSalvo = sessionStorage.getItem("nome_usuario");
    this.nomeUsuario = nomeSalvo ? nomeSalvo : '?';

    // Recupera estado do sidenav
    const savedState = localStorage.getItem('sidenavState');
    if (savedState !== null) {
      this.isMinimized = JSON.parse(savedState);
    }

    // Verifica o tamanho inicial da tela
    this.checkScreenSize();

    // Observa eventos de navegação
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => { });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 768) {
      this.isSearchHidden = false;  // Garante que a barra de pesquisa não fique oculta
      this.isSearchExpanded = true; // Garante que a pesquisa fique expandida
    } else {
      this.isSearchHidden = true;   // Garante que a pesquisa fique oculta em telas pequenas
    }
  }

  toggleSidenav() {
    this.isMinimized = !this.isMinimized;
    localStorage.setItem('sidenavState', JSON.stringify(this.isMinimized));
  }

  logout() {
    sessionStorage.removeItem("nome_usuario");
    sessionStorage.removeItem("email_usuario");
    this.router.navigate(['/login']);
  }
}
