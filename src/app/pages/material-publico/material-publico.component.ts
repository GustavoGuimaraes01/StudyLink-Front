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
  nomeUsuario: string = '';
  isListaOpen: boolean = false;
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private atividadesService: AtividadesService,
    private richTextService: RichTextService,
    private materialService: MateriaisService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const emailCookie = this.getCookie('email');
    const nomeUsuarioCookie = this.getCookie('nome_usuario');

    if (emailCookie && nomeUsuarioCookie) {
      this.email = emailCookie;
      this.nomeUsuario = nomeUsuarioCookie;
    } else {
      const emailSalvo = sessionStorage.getItem('email');
      this.email = emailSalvo ? emailSalvo : 'não cadastrado';
      const nomeSalvo = sessionStorage.getItem('nome_usuario');
      this.nomeUsuario = nomeSalvo ? nomeSalvo : '?';
    }


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

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
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
  
  voltar(): void {
    this.router.navigate(['/descobrir']);
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
  toggleListaSuspensa(): void {
    this.isListaOpen = !this.isListaOpen;
  }

  logout() {
    sessionStorage.removeItem('nome_usuario');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('auth-token');

    this.deleteCookie('auth-token');
    this.deleteCookie('email');
    this.deleteCookie('nome_usuario');

    this.router.navigate(['/login']);
}

deleteCookie(name: string): void {
    const date = new Date();
    date.setTime(date.getTime() - 1); 
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=;${expires};path=/`; 
}
copiarAnotacao(): void {
  if (!this.anotacaoSelecionada) {
    console.error('Nenhuma anotação selecionada.');
    return;
  }

  const anotacaoIdOriginal = this.anotacaoSelecionada.id!;
  const titulo = this.anotacaoSelecionada.titulo;

  console.log('ID da anotação original:', anotacaoIdOriginal);

  const dialogRef = this.dialog.open(SelecionarMaterialComponent, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe((materialId: number | undefined) => {
    if (!materialId) {
      console.warn('Nenhum material selecionado.');
      return;
    }

    this.richTextService.buscarConteudoPorAnotacaoId(anotacaoIdOriginal).subscribe({
      next: (conteudoResponse: AnotacaoConteudoDTO[]) => {
        console.log('Resposta completa ao buscar conteúdo:', conteudoResponse);
    
        if (!conteudoResponse || conteudoResponse.length === 0) {
          console.error('Nenhum conteúdo encontrado para a anotação original.');
          alert('Erro ao carregar o conteúdo da anotação original.');
          return;
        }
    
        const conteudo = conteudoResponse[0].conteudo || ''; // Acessa o conteúdo do primeiro item
        console.log('Conteúdo recuperado:', conteudo);
        console.log('Tamanho do conteúdo:', conteudo.length);
    
        const novaAnotacao: CriarAnotacaoDTO = { 
          titulo, 
          materialId 
        };
    
        this.atividadesService.criarAtividade(novaAnotacao).subscribe({
          next: (anotacaoCriada) => {
            if (!anotacaoCriada.id) {
              console.error('Criação da anotação falhou');
              alert('Erro ao criar nova anotação.');
              return;
            }
    
            const novoConteudo: AnotacaoConteudoDTO = {
              anotacaoId: anotacaoCriada.id,
              conteudo: conteudo
            };
    
            console.log('Novo conteúdo a ser salvo:', novoConteudo);
    
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