import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: "login", loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent) },
  { path: "cadastro", loadComponent: () => import('./pages/cadastro/cadastro.component').then(c => c.CadastroComponent) },
  { path: "home", loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent) },
  { path: "materias", loadComponent: () => import('./pages/materias/materias.component').then(c => c.MateriasComponent) },
  { path: "descobrir", loadComponent: () => import('./pages/descobrir/descobrir.component').then(c => c.DescobrirComponent) },
  { path: 'atividade/:materialId', loadComponent: () => import('./pages/atividade/atividade.component').then(c => c.AtividadeComponent) },
  { path: 'material-publico/:materialId', loadComponent: () => import('./pages/material-publico/material-publico.component').then(c => c.MaterialPublicoComponent) },
  { path: 'redefinir-senha', loadComponent: () => import ('./components/redefinir-senha/redefinir-senha.component').then (c => c.RedefinirSenhaComponent)},
  { path: "", loadComponent: () => import('./pages/landing-page/landing-page.component').then(c => c.LandingPageComponent) },


  
  { path: "**", loadComponent: () => import('./pages/nao-encontrada/nao-encontrada.component').then(c => c.NaoEncontradaComponent) },


  
  
  
  
];
