import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { TarefasComponent } from './pages/tarefas/tarefas.component';
import { MateriasComponent } from './pages/materias/materias.component';
import { ConfigComponent } from './pages/config/config.component';
import { BarraDePesquisaComponent } from './components/barra-de-pesquisa/barra-de-pesquisa.component';
import { AgendadorComponent } from './components/agendador/agendador.component';
import { CriarMaterialComponent } from './pages/criar-material/criar-material.component';
import { AtividadeComponent } from './pages/atividade/atividade.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path:"cadastro", component: CadastroComponent}, 
    {path:"home",component: HomeComponent},
    {path:"materiais",component: MateriasComponent},
    {path:"config",component: ConfigComponent},
    {path:"agenda", component:AgendadorComponent},
    {path:"atividades", component:AtividadeComponent},
    {path:"p", component:BarraDePesquisaComponent},

];
