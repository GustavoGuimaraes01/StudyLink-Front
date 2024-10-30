import { Component } from '@angular/core';
import { MenuPesquisaComponent } from '../../components/menu-pesquisa/menu-pesquisa.component';
import { CriarMaterialComponent } from '../criar-material/criar-material.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [MenuPesquisaComponent, CriarMaterialComponent,CommonModule],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css',
})
export class MateriasComponent {

  
  materiais = [
    {
      id:1,
      imagem: 'img/quimica.png',
      assunto: 'Estequiometria',
      area: 'Química'
    },
  ]


  isCriarMaterialOpen = false;

  openCriarMaterial() {
    this.isCriarMaterialOpen = true;
  }
}
