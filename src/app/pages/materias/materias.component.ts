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
  styleUrls: ['./materias.component.css'],
})
export class MateriasComponent {
  selectedMaterialId: number | null = null;
  materiais: Material[] = [];
  isCriarMaterialOpen = false;
  materialParaEditar: Material | null = null;
  searchTerm: string = ''; 

  constructor(private materialService: MaterialService) {
    this.carregarMateriais(); 
  }

  carregarMateriais() {
    if (this.searchTerm) {
    
      this.materialService.pesquisarMateriais(this.searchTerm).subscribe({
        next: (materiais) => {
          this.materiais = materiais;
        },
        error: (error) => {
          console.error('Erro ao pesquisar materiais:', error);
        }
      });
    } else {
    
      this.materialService.listarTodosMateriais().subscribe({
        next: (materiais) => {
          this.materiais = materiais;
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

  // Método para lidar com a busca
  onBuscar() {
    this.carregarMateriais(); // Recarregar os materiais ao fazer uma busca
  }

  // Método para limpar o termo de busca
  limparBusca() {
    this.searchTerm = '';
    this.carregarMateriais(); // Carregar todos os materiais ao limpar a busca
  }
}
