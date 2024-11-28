import { Component, ChangeDetectorRef } from '@angular/core';
import { MenuPesquisaComponent } from '../../components/menu-pesquisa/menu-pesquisa.component';
import { CriarMaterialComponent } from '../criar-material/criar-material.component';
import { CommonModule } from '@angular/common';
import { MateriaisService, Material } from  '../../services/materiais/materiais.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [MenuPesquisaComponent, CriarMaterialComponent, CommonModule, MatIconModule],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'],
})
export class MateriasComponent {
  selectedMaterialId: number | null = null;
  materiais: Material[] = [];
  isCriarMaterialOpen = false;
  materialParaEditar: Material | null = null;
  searchTerm: string = ''; 

  constructor(private materiaisService: MateriaisService, private cdr: ChangeDetectorRef) {
    this.carregarMateriais(); 
  }

  carregarMateriais() {
    if (this.searchTerm) {
    
      this.materiaisService.pesquisarMateriais(this.searchTerm).subscribe({
        next: (materiais) => {
          this.materiais = materiais;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao pesquisar materiais:', error);
        }
      });
    } else {
    
      this.materiaisService.listarMateriais().subscribe({
        next: (materiais) => {
          this.materiais = materiais;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao carregar materiais:', error);
        }
      });
    }
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
      this.materiaisService.deletarMaterial(id).subscribe({
        next: () => {
          this.carregarMateriais();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao deletar material:', error);
        }
      });
    }
  }

  onBuscar() {
    this.carregarMateriais(); 
  }

  limparBusca() {
    this.searchTerm = '';
    this.carregarMateriais(); 
  }
}
