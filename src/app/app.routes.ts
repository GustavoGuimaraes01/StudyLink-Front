import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { HomeComponent } from './pages/home/home.component';
import { MateriasComponent } from './pages/materias/materias.component';
import { ConfigComponent } from './pages/config/config.component';
import { AgendadorComponent } from './components/agendador/agendador.component';
import { AtividadeComponent } from './pages/atividade/atividade.component';
import { NaoEncontradaComponent } from './pages/nao-encontrada/nao-encontrada.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path:"cadastro", component: CadastroComponent}, 
    {path:"home",component: HomeComponent},
    {path:"materiais",component: MateriasComponent},
    {path:"config",component: ConfigComponent},
    {path:"agenda", component:AgendadorComponent},
    {path:"atividades", component:AtividadeComponent},

    {path:"v", component:NaoEncontradaComponent},

];
