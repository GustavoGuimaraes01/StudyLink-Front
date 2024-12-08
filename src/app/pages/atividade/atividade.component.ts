import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RichTextComponent } from '../../components/rich-text/rich-text.component';
import { AnotacaoDTO, CriarAnotacaoDTO, AtividadesService } from '../../services/atividades/atividades.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaisService } from '../../services/materiais/materiais.service';
import { MatMenuModule } from '@angular/material/menu';
import { Material } from '../../types/materiais';
import { AnotacaoConteudoDTO, RichTextService } from '../../services/rich-text/rich-text.service';

@Component({
  selector: 'app-atividade',
  standalone: true,
  imports: [
  MatToolbarModule, 
    MatIconModule, 
    RichTextComponent, 
    CommonModule, 
    RouterModule, 
    MatMenuModule
  ],
  templateUrl: './atividade.component.html',
  styleUrls: ['./atividade.component.css']
})
export class AtividadeComponent implements OnInit {

  @ViewChild('menuSecundario') menuSecundario!: ElementRef;

  private isResizing = false;
  private startX = 0;
  private startWidth = 0;

  atividades: AnotacaoDTO[] = [];
  materialId: number | undefined;
  materiais: Material[] = [];
  materialAtual: Material | null = null; 
  anotacaoSelecionada: AnotacaoDTO | null = null;
  conteudoRichText: any;

  constructor(
    private route: ActivatedRoute,
    private atividadesService: AtividadesService,
    private materiaisService: MateriaisService,
    private richTextService: RichTextService,
    private router: Router
    
  ) {}
  


  //Relacionamento de materiais com atividades
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('materialId');
    this.materialId = idParam ? Number(idParam) : undefined;
  
    if (!this.materialId) {
      alert('Material inválido. Retornando à página de materiais.');
      this.router.navigate(['/materias']);
      return;
    }
  
    this.carregarMateriais();
  }
  
  carregarMateriais(): void {
    this.materiaisService.listarMateriais().subscribe({
      next: (materiais) => {
        this.materiais = materiais;
  
        if (this.materialId) {
          this.selecionarMaterial(this.materialId);
        }
      },
      error: (error) => {
        console.error('Erro ao carregar materiais:', error);
      },
    });
  }

  selecionarMaterial(material: Material | number) {
    const materialParaSelecionar = typeof material === 'number' 
      ? this.materiais.find(m => m.id === material)
      : material;
  
    if (materialParaSelecionar) {
      this.materialAtual = materialParaSelecionar;
      this.materialId = materialParaSelecionar.id;
  
      // Atualiza a URL com o novo ID do material
      this.router.navigate([`atividade/${this.materialId}`]);
  
      this.carregarAtividades();
    }
  }

  voltarParaMateriais(): void {
    this.router.navigate(['/materias']);
  }
  //Fim da parte de materiais


  //Parte de atividades
  selecionarAtividade(anotacao: AnotacaoDTO): void {
    this.anotacaoSelecionada = anotacao;
  
    if (anotacao?.id) {
      this.richTextService.buscarConteudoPorAnotacaoId(anotacao.id).subscribe({
        next: (conteudo : any) => {
          this.conteudoRichText = conteudo; // Atualiza o conteúdo do Rich Text
        },
        error: (error : any) => {
          console.error('Erro ao carregar conteúdo:', error);
          alert('Erro ao carregar o conteúdo da anotação.');
        }
      });
    }
  }
  

  carregarAtividades(): void {
  if (this.materialId === undefined) return;

  this.atividadesService
    .listarAtividadesPorMaterial(this.materialId)
    .subscribe({
      next: (response) => {
        this.atividades = (response || []).sort((a, b) => {
          const dateA = a.dataUltimaAlteracao ? new Date(a.dataUltimaAlteracao).getTime() : 0;
          const dateB = b.dataUltimaAlteracao ? new Date(b.dataUltimaAlteracao).getTime() : 0;
          return dateB - dateA; 
        });

        if (this.atividades.length > 0) {
          if (!this.anotacaoSelecionada) {
            this.selecionarAtividade(this.atividades[0]);
          } else {
            const currentActivityStillExists = this.atividades.some(
              (a) => a.id === this.anotacaoSelecionada?.id
            );

            if (!currentActivityStillExists) {
              this.selecionarAtividade(this.atividades[0]);
            }
          }
        } else {
          this.anotacaoSelecionada = null;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar atividades:', error);
      },
    });
}


  criarAtividade(): void {
    if (!this.materialId) {
      alert('Selecione um material primeiro');
      return;
    }
  
    const novaAtividade: CriarAnotacaoDTO = { 
      titulo: 'Nova Anotacao',
      materialId: this.materialId,
      dataUltimaAlteracao: this.formatarData(new Date())
    };
  
    // Logando dado por dado
    console.log('Título:', novaAtividade.titulo);
    console.log('Material ID:', novaAtividade.materialId);
    console.log('Data Última Alteração:', novaAtividade.dataUltimaAlteracao);
  
    this.atividadesService.criarAtividade(novaAtividade).subscribe({
      next: (atividadeCriada) => {
        this.atividades.unshift(atividadeCriada);  
        this.selecionarAtividade(atividadeCriada);
      },
      error: (error) => {
        console.error('Erro ao criar nova atividade:', error);
        alert('Erro ao criar nova atividade. Por favor, tente novamente.');
      }
    });
  }
  
  
  deletarAtividade(): void {
    if (!this.anotacaoSelecionada?.id) {
      alert('Nenhuma atividade selecionada');
      return;
    }
  
    if (confirm('Tem certeza que deseja deletar esta atividade?')) {
      this.atividadesService.deletarAtividade(this.anotacaoSelecionada.id).subscribe({
        next: () => {
          this.atividades = this.atividades.filter(a => a.id !== this.anotacaoSelecionada?.id);
  
          if (this.atividades.length > 0) {
            this.selecionarAtividade(this.atividades[0]);
          } else {
            this.anotacaoSelecionada = null;
          }
        },
        error: (error) => {
          console.error('Erro ao deletar atividade:', error);
          alert('Erro ao deletar atividade. Por favor, tente novamente.');
        }
      });
    }
  }

  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
  }

  //Mudar o tamanho do menu-lateral-secundario

  onResizeStart(event: MouseEvent): void {
    const menuSecundario = this.menuSecundario.nativeElement;
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = menuSecundario.offsetWidth;

    const onMove = (moveEvent: MouseEvent) => this.onResizeMove(moveEvent);
    const onMouseUp = () => {
      this.onResizeEnd(onMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onResizeMove(event: MouseEvent): void {
    if (this.isResizing) {
      const menuSecundario = this.menuSecundario.nativeElement;
      const diff = event.clientX - this.startX;
      const newWidth = this.startWidth + diff;
      menuSecundario.style.width = `${newWidth}px`;
    }
  }

  onResizeEnd(onMove: (event: MouseEvent) => void): void {
    this.isResizing = false;
    document.removeEventListener('mousemove', onMove);
  }

  onConteudoSalvo(evento: {
    conteudoResult: AnotacaoConteudoDTO, 
    titulo?: string, 
    dataUltimaAlteracao?: string
  }) {
    if (this.anotacaoSelecionada && this.anotacaoSelecionada.id) {
      // Prepare the update DTO
      const updateDTO: CriarAnotacaoDTO = {
        materialId: this.materialId,
        titulo: evento.titulo || this.anotacaoSelecionada.titulo,
        dataUltimaAlteracao: evento.dataUltimaAlteracao || this.anotacaoSelecionada.dataUltimaAlteracao
      };
  
      this.atividadesService.atualizarAtividade(this.anotacaoSelecionada.id, updateDTO).subscribe({
        next: (updatedAnotacao) => {
          const index = this.atividades.findIndex(a => a.id === this.anotacaoSelecionada?.id);
          if (index !== -1) {
            this.atividades[index] = updatedAnotacao;
  
            // Resort the activities list
            this.atividades.sort((a, b) => {
              const dateA = a.dataUltimaAlteracao ? new Date(a.dataUltimaAlteracao).getTime() : 0;
              const dateB = b.dataUltimaAlteracao ? new Date(b.dataUltimaAlteracao).getTime() : 0;
              return dateB - dateA; 
            });
  
            // Update the selected activity
            this.selecionarAtividade(updatedAnotacao);
          }
        },
        error: (error) => {
          console.error('Erro ao atualizar atividade:', error);
        }
      });
    }
  }

  
}