import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MateriaisService } from '../../services/materiais/materiais.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-selecionar-material',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './selecionar-material.component.html',
  styleUrls: ['./selecionar-material.component.css'],
})
export class SelecionarMaterialComponent {
  materiais: any[] = [];

  constructor(
    private materiaisService: MateriaisService,
    private dialogRef: MatDialogRef<SelecionarMaterialComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.carregarMateriais();
  }

  carregarMateriais(): void {
    this.materiaisService.listarMateriais().subscribe({
      next: (materiais) => {
        this.materiais = materiais;
      },
      error: (erro) => {
        console.error('Erro ao carregar materiais:', erro);
      },
    });
  }

  selecionarMaterial(materialId: number): void {
    this.dialogRef.close(materialId); // Retorna o ID do material selecionado
  }
}
