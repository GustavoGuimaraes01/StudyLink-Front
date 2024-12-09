import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaisService } from '../../services/materiais/materiais.service';
import { AnotacaoDTO, AtividadesService } from '../../services/atividades/atividades.service';
import { RichTextService } from '../../services/rich-text/rich-text.service';
import { Material } from '../../types/materiais';
import { MatMenuModule } from '@angular/material/menu';
import { RichTextComponent } from '../../components/rich-text/rich-text.component';

@Component({
  selector: 'app-material-publico',
  standalone: true,
  imports: [
  MatToolbarModule, 
    MatIconModule, 
    CommonModule, 
    RouterModule,
    MatMenuModule,
    RichTextComponent
  ],
  templateUrl: './material-publico.component.html',
  styleUrls: ['./material-publico.component.css']
})
export class MaterialPublicoComponent implements OnInit {
  anotacoes: AnotacaoDTO[] = [];
  materialId: number | undefined;
  materialAtual: any;
  anotacaoSelecionada: AnotacaoDTO | null = null;
  conteudoRichText: any;

  nomeUsuario: string = '';
  email: string = '';
  isListaOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private atividadesService: AtividadesService,
    private richTextService: RichTextService,
    private materialService: MateriaisService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('materialId');
    this.materialId = idParam ? Number(idParam) : undefined;
  
    if (!this.materialId) {
      alert('Material inválido. Retornando à página inicial.');
      this.router.navigate(['/descobrir']);
      return;
    }
  
    // Buscar detalhes do material
    this.carregarMaterial();
    this.carregarAnotacoes();
  }

  carregarMaterial() {
    this.materialService.listarMateriaisPublicos().subscribe({
      next: (materiais) => {
        // Encontrar o material específico baseado no ID
        this.materialAtual = materiais.find(material => material.id === this.materialId);
        
        if (!this.materialAtual) {
          console.error('Material não encontrado');
          this.router.navigate(['/descobrir']);
        }
      },
      error: (erro) => {
        console.error('Erro ao carregar material', erro);
        this.router.navigate(['/descobrir']);
      }
    });
  }


  carregarAnotacoes(): void {
    this.atividadesService.listarAtividadesPorMaterial(this.materialId!).subscribe({
      next: (anotacoes) => {
        this.anotacoes = (anotacoes || []).sort((a, b) => {
          const dateA = a.dataUltimaAlteracao ? new Date(a.dataUltimaAlteracao).getTime() : 0;
          const dateB = b.dataUltimaAlteracao ? new Date(b.dataUltimaAlteracao).getTime() : 0;
          return dateB - dateA; 
        });

        if (this.anotacoes.length > 0) {
          this.selecionarAnotacao(this.anotacoes[0]);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar anotações:', error);
        this.router.navigate(['/descobrir']);
      },
    });
  }

  selecionarAnotacao(anotacao: AnotacaoDTO): void {
    this.anotacaoSelecionada = anotacao;
  
    if (anotacao?.id) {
      this.richTextService.buscarConteudoPorAnotacaoId(anotacao.id).subscribe({
        next: (conteudo: any) => {
          this.conteudoRichText = conteudo;
        },
        error: (error: any) => {
          console.error('Erro ao carregar conteúdo:', error);
        }
      });
    }
  }

  toggleListaSuspensa() {
    this.isListaOpen = !this.isListaOpen;
  }

  logout() {
    sessionStorage.removeItem('nome_usuario');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('auth-token');
    this.router.navigate(['/login']);
  }
}