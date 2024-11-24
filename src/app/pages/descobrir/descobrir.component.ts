import { Component, OnInit } from '@angular/core';
import { MateriaisService, MaterialReadDTO } from '../../services/materiais/materiais.service';
import { MenuPesquisaComponent } from "../../components/menu-pesquisa/menu-pesquisa.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-descobrir',
  standalone: true,
  imports: [MenuPesquisaComponent, CommonModule],
  templateUrl: './descobrir.component.html',
  styleUrls: ['./descobrir.component.css']
})
export class DescobrirComponent implements OnInit {
  materiais: MaterialReadDTO[] = [];
  isLoading: boolean = false;
  mensagemErro: string = '';

  constructor(
    private materiaisService: MateriaisService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Verificar se há termo de pesquisa na URL
    this.route.queryParams.subscribe(params => {
      const termoPesquisa = params['pesquisa'];
      if (termoPesquisa) {
        this.realizarPesquisa(termoPesquisa);
      } else {
        this.carregarMateriaisPublicos();
      }
    });
  }

  handleImageError(event: any): void {
    event.target.src = 'img/students.svg'; 
  }

  realizarPesquisa(termo: string): void {
    this.isLoading = true;
    this.mensagemErro = '';
    
    if (termo.trim()) {
      this.materiaisService.pesquisarMateriais(termo).subscribe({
        next: (materiais) => {
          this.materiais = materiais;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao pesquisar materiais:', error);
          this.mensagemErro = 'Erro ao pesquisar materiais. Tente novamente.';
          this.isLoading = false;
        }
      });
    } else {
      this.carregarMateriaisPublicos();
    }
  }

  carregarMateriaisPublicos(): void {
    this.isLoading = true;
    this.mensagemErro = '';
    
    this.materiaisService.listarMateriaisPublicos().subscribe({
      next: (materiais) => {
        this.materiais = materiais;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar materiais:', error);
        this.mensagemErro = 'Erro ao carregar materiais. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  onPesquisaRealizada(termo: string): void {
    this.realizarPesquisa(termo);
  }
}