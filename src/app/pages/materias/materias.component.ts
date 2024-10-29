import { Component } from '@angular/core';
import { MenuPesquisaComponent } from '../../components/menu-pesquisa/menu-pesquisa.component';
import { MatDialog } from '@angular/material/dialog';
import { CriarMaterialComponent } from '../criar-material/criar-material.component';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [MenuPesquisaComponent, CriarMaterialComponent],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css',
})
export class MateriasComponent {
  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(CriarMaterialComponent, {
      width: "800px",         // Largura fixa
      height: "500px",       // Altura fixa
      
    });
   }
}
