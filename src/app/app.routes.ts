import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { MenuPesquisaComponent } from './components/menu-pesquisa/menu-pesquisa.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
        
    },
    {
        path:"cadastro",
        component: CadastroComponent
    },
    {
        path:"menu",
        component: MenuPesquisaComponent
    }
    
];
