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
  isCriarMaterialOpen = false;

  openCriarMaterial() {
    this.isCriarMaterialOpen = true;
  }
}
