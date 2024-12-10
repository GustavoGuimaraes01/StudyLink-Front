import { Component, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
    CommonModule
  ],
  templateUrl: './menu-pesquisa.component.html',
  styleUrls: ['./menu-pesquisa.component.css']
})

export class MenuPesquisaComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  @Output() pesquisaRealizada = new EventEmitter<string>();

  private searchTerms = new Subject<string>();
  termoPesquisa: string = ''; 
  sidenavMode: 'over' | 'side' = 'side';
  sidenavOpened = true;
  nomeUsuario: string = '';
  isListaOpen: boolean = false;
  email: string = '';
  isSearchHidden = true;
  isSearchExpanded = false;
  isSearchActive: boolean = false;
  isScreenSmall: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const emailSalvo = sessionStorage.getItem('email');
    this.email = emailSalvo ? emailSalvo : 'não cadastrado';
    const nomeSalvo = sessionStorage.getItem('nome_usuario');
    this.nomeUsuario = nomeSalvo ? nomeSalvo : '?';
    this.checkScreenSize();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidenavMode === 'over') {
          this.sidenavOpened = false;
        }
      });

    this.searchTerms
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => {
        this.termoPesquisa = term;
      });
  }
  realizarPesquisa(termo: string): void {
    // Verifica se o termo está vazio
    if (!termo.trim()) {
      this.router.url.includes('http://localhost:4200/descobrir')
        ? this.pesquisaRealizada.emit('') // Emite vazio para resetar os materiais
        : this.router.navigate(['/descobrir']); // Navega para a rota padrão sem parâmetro
      return;
    }
  
    // Realiza a pesquisa com o termo fornecido
    if (this.router.url.includes('http://localhost:4200/descobrir')) {
      this.pesquisaRealizada.emit(termo); 
    } else {
      this.router.navigate(['/descobrir'], { queryParams: { pesquisa: termo } });
    }
  }
  
  onSearchInput(event: Event): void {
    const termo = (event.target as HTMLInputElement).value.trim();
    this.searchTerms.next(termo);
  
    // Se o campo de entrada for limpo, reseta os materiais
    if (!termo) {
      this.realizarPesquisa('');
    }
  }
  
  @HostListener('keydown.enter', ['$event'])
  onKeydownEnter(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (input.tagName.toLowerCase() === 'input') {
      const termo = input.value.trim();
      if (termo) {
        this.realizarPesquisa(termo);
      } else {
        this.realizarPesquisa(''); 
      }
    }
  }
  
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
    sessionStorage.removeItem('nome_usuario');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('auth-token');
    this.router.navigate(['/login']);
  }
}