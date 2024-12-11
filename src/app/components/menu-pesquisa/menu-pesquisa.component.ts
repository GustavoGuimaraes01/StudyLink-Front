import { Component, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ImageUploadDialogComponent } from '../image-upload-dialog/image-upload-dialog.component';


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
    MatDialogModule,
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
  profileImageUrl: string | null = null
  imagemUsuario : string = ''

  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    const emailCookie = this.getCookie('email');
    const nomeUsuarioCookie = this.getCookie('nome_usuario');

    if (emailCookie && nomeUsuarioCookie) {
      this.email = emailCookie;
      this.nomeUsuario = nomeUsuarioCookie;
    } else {
      const emailSalvo = sessionStorage.getItem('email');
      this.email = emailSalvo ? emailSalvo : 'não cadastrado';
      const nomeSalvo = sessionStorage.getItem('nome_usuario');
      this.nomeUsuario = nomeSalvo ? nomeSalvo : '?';
    }
    const imagemPerfilSalva = sessionStorage.getItem('profileImageUrl');
    this.profileImageUrl = imagemPerfilSalva ? imagemPerfilSalva : null;

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
  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  realizarPesquisa(termo: string): void {
    if (!termo.trim()) {
      this.router.url.includes('http://localhost:4200/descobrir')
        ? this.pesquisaRealizada.emit('')
        : this.router.navigate(['/descobrir']); 
      return;
    }
  
    if (this.router.url.includes('http://localhost:4200/descobrir')) {
      this.pesquisaRealizada.emit(termo); 
    } else {
      this.router.navigate(['/descobrir'], { queryParams: { pesquisa: termo } });
    }
  }
  
  onSearchInput(event: Event): void {
    const termo = (event.target as HTMLInputElement).value.trim();
    this.searchTerms.next(termo);
  
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

  toggleListaSuspensa() {
    this.isListaOpen = !this.isListaOpen;
  }

  logout() {
    sessionStorage.removeItem('nome_usuario');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('auth-token');
    this.router.navigate(['/login']);
  }

  openImageUploadDialog() {
    const dialogRef = this.dialog.open(ImageUploadDialogComponent, {
      width: '400px',
      data: { currentImageUrl: this.profileImageUrl }
    });

    dialogRef.afterClosed().subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.profileImageUrl = newImageUrl;
      }
    });
  }
}