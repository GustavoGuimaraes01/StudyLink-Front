// materias.component.ts
import { Component } from '@angular/core';
import { MenuPesquisaComponent } from '../../components/menu-pesquisa/menu-pesquisa.component';
import { CriarMaterialComponent } from '../criar-material/criar-material.component';
import { CommonModule } from '@angular/common';
import { MaterialService, Material } from'../../services/materiais/materiais.service';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [MenuPesquisaComponent, CriarMaterialComponent, CommonModule],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css',
})
export class MateriasComponent {
  selectedMaterialId: number | null = null;
  materiais: Material[] = [];
  isCriarMaterialOpen = false;
  materialParaEditar: Material | null = null;

  constructor(private materialService: MaterialService) {
    this.carregarMateriais();
  }

  carregarMateriais() {
    this.materialService.listarMateriais().subscribe({
      next: (materiais) => {
        this.materiais = materiais;
      },
      error: (error) => {
        console.error('Erro ao carregar materiais:', error);
      }
    });
  }

  openCriarMaterial(material?: Material) {
    this.materialParaEditar = material || null;
    this.isCriarMaterialOpen = true;
  }

  onMaterialSalvo() {
    this.carregarMateriais();
    this.isCriarMaterialOpen = false;
    this.materialParaEditar = null;
  }

  deletarMaterial(id: number) {
    if (confirm('Tem certeza que deseja deletar este material?')) {
      this.materialService.deletarMaterial(id).subscribe({
        next: () => {
          this.carregarMateriais();
        },
        error: (error) => {
          console.error('Erro ao deletar material:', error);
        }
      });
    }
  }
}