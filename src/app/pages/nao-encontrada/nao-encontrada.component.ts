import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nao-encontrada',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  templateUrl: './nao-encontrada.component.html',
  styleUrls: ['./nao-encontrada.component.css'],
})
export class NaoEncontradaComponent implements OnInit {
  nomeUsuario: string | null = null;
  email: string | null = null;
  isListaOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
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
  }

  toggleListaSuspensa(): void {
    this.isListaOpen = !this.isListaOpen;
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  logout() {
    sessionStorage.removeItem('nome_usuario');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('auth-token');

    this.deleteCookie('auth-token');
    this.deleteCookie('email');
    this.deleteCookie('nome_usuario');

    this.router.navigate(['/login']);
  }

  deleteCookie(name: string): void {
    const date = new Date();
    date.setTime(date.getTime() - 1);  
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=;${expires};path=/`;  
  }
}
