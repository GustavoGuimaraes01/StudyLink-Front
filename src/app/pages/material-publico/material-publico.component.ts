import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaisService } from '../../services/materiais/materiais.service';
import { AnotacaoDTO, AtividadesService, CriarAnotacaoDTO } from '../../services/atividades/atividades.service';
import { AnotacaoConteudoDTO, RichTextService } from '../../services/rich-text/rich-text.service';
import { MaterialReadDTO } from '../../types/materiais';
import { MatMenuModule } from '@angular/material/menu';
import { RichTextComponent } from '../../components/rich-text/rich-text.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SelecionarMaterialComponent } from '../../components/selecionar-material/selecionar-material.component';

@Component({
  selector: 'app-material-publico',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatIconModule, 
    CommonModule, 
    RouterModule,
    MatMenuModule,
    RichTextComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './material-publico.component.html',
  styleUrls: ['./material-publico.component.css']
})
export class MaterialPublicoComponent implements OnInit {
  anotacoes: AnotacaoDTO[] = [];
  materialId: number | undefined;
  materialAtual: MaterialReadDTO | null = null;
  anotacaoSelecionada: AnotacaoDTO | null = null;
  conteudoRichText: any;

  nomeUsuario: string = sessionStorage.getItem('nome_usuario') || '';
  email: string = sessionStorage.getItem('email') || '';
  isListaOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private atividadesService: AtividadesService,
    private richTextService: RichTextService,
    private materialService: MateriaisService,
    private dialog: MatDialog,
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
  
    this.carregarMaterial();
    this.carregarAnotacoes();
  }

  carregarMaterial() {
    this.materialService.listarMateriaisPublicos().subscribe({
      next: (materiais) => {
        this.materialAtual = materiais.find(material => material.id === this.materialId) || null;
        
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


  copiarAnotacao(): void {
    if (!this.anotacaoSelecionada) {
      console.error('Nenhuma anotação selecionada.');
      return;
    }
  
    const anotacaoId = this.anotacaoSelecionada.id!;
    const titulo = this.anotacaoSelecionada.titulo;
  
    // Abrir o modal para selecionar o material
    const dialogRef = this.dialog.open(SelecionarMaterialComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((materialId: number | undefined) => {
      if (!materialId) {
        console.warn('Nenhum material selecionado.');
        return;
      }
  
      // Buscar conteúdo da anotação selecionada
      this.richTextService.buscarConteudoPorAnotacaoId(anotacaoId).subscribe({
        next: (conteudoResponse: AnotacaoConteudoDTO | null) => {
          const conteudo = conteudoResponse?.conteudo || ''; // Padrão vazio se não existir
  
          // Criar nova anotação
          const novaAnotacao: CriarAnotacaoDTO = { titulo, materialId };
  
          this.atividadesService.criarAtividade(novaAnotacao).subscribe({
            next: (anotacaoCriada) => {
              // Criar o conteúdo associado à nova anotação
              const novoConteudo: AnotacaoConteudoDTO = {
                anotacaoId: anotacaoCriada.id!,
                conteudo,
              };
  
              this.richTextService.salvarConteudoAnotacao(novoConteudo).subscribe({
                next: () => {
                  alert('Anotação e conteúdo copiados com sucesso!');
                  this.router.navigate(['/materias']);
                },
                error: (erro) => {
                  console.error('Erro ao salvar conteúdo da nova anotação:', erro);
                  alert('Erro ao copiar conteúdo da anotação.');
                },
              });
            },
            error: (erro) => {
              console.error('Erro ao criar nova anotação:', erro);
              alert('Erro ao criar nova anotação.');
            },
          });
        },
        error: (erro) => {
          console.error('Erro ao buscar conteúdo da anotação selecionada:', erro);
          alert('Erro ao carregar o conteúdo da anotação original.');
        },
      });
    });
  }
  
  
  
 
}