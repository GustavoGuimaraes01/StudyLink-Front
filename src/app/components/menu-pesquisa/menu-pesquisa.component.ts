import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  sidenavMode: 'over' | 'side' = 'side';
  sidenavOpened = true;
  nomeUsuario: string = "";
  isListaOpen: boolean = false;
  email: string = '';
  isSearchHidden = true;
  isSearchExpanded = false;
  isSearchActive: boolean = false;
  isScreenSmall: boolean = false;

  constructor(private router: Router) {}

  toggleListaSuspensa() {
    this.isListaOpen = !this.isListaOpen;
  }

  toggleSearch() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 650) {
      if (this.isSearchActive) {
        this.isSearchExpanded = false;
        setTimeout(() => {
          this.isSearchHidden = true;
          this.isSearchActive = false;
        }, 300);
      } else {
        this.isSearchHidden = false;
        this.isSearchExpanded = true;
        this.isSearchActive = true;
        setTimeout(() => {
          this.searchInput?.nativeElement?.focus();
        }, 100);
      }
    }
  }

  ngOnInit() {
    const emailSalvo = sessionStorage.getItem("email");
    this.email = emailSalvo ? emailSalvo : 'não cadastrado';
    const nomeSalvo = sessionStorage.getItem("nome_usuario");
    this.nomeUsuario = nomeSalvo ? nomeSalvo : '?';
    this.checkScreenSize();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.sidenavMode === 'over') {
        this.sidenavOpened = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const screenWidth = window.innerWidth;
    this.isScreenSmall = screenWidth <= 650;
    if (this.isScreenSmall) {
      this.sidenavMode = 'over';
      this.sidenavOpened = false;
      this.isSearchHidden = true;
    } else {
      this.sidenavMode = 'side';
      this.sidenavOpened = true;
      this.isSearchHidden = false;
      this.isSearchExpanded = false;
      this.isSearchActive = false;
    }
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout() {
    sessionStorage.removeItem("nome_usuario");
    sessionStorage.removeItem("email_usuario");
    this.router.navigate(['/login']);
  }
}