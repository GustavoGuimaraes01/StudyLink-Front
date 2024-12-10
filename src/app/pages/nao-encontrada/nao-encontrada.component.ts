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
    this.nomeUsuario = sessionStorage.getItem('nome_usuario');
    this.email = sessionStorage.getItem('email');
  }

  toggleListaSuspensa(): void {
    this.isListaOpen = !this.isListaOpen;
  }

  logout(): void {
    sessionStorage.removeItem('nome_usuario');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('auth-token');

    this.router.navigate(['/login']);
  }
}
