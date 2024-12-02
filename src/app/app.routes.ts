import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { MateriasComponent } from './pages/materias/materias.component';
import { AtividadeComponent } from './pages/atividade/atividade.component';
import { NaoEncontradaComponent } from './pages/nao-encontrada/nao-encontrada.component';
import { DescobrirComponent } from './pages/descobrir/descobrir.component';

export const routes: Routes = [
  { path: "login", loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent) },
  { path: "cadastro", loadComponent: () => import('./pages/cadastro/cadastro.component').then(c => c.CadastroComponent) },
  { path: "home", loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent) },
  { path: "materias", loadComponent: () => import('./pages/materias/materias.component').then(c => c.MateriasComponent) },
  { path: "descobrir", loadComponent: () => import('./pages/descobrir/descobrir.component').then(c => c.DescobrirComponent) },
  { path: "atividades", loadComponent: () => import('./pages/atividade/atividade.component').then(c => c.AtividadeComponent) },
  { path: "", loadComponent: () => import('./pages/landing-page/landing-page.component').then(c => c.LandingPageComponent) },
  
  
  
  
  { path: "**", loadComponent: () => import('./pages/nao-encontrada/nao-encontrada.component').then(c => c.NaoEncontradaComponent) },
];
