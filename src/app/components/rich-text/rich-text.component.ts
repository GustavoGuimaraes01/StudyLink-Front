import { Component, ViewEncapsulation, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'; 
import Quill from 'quill'; 
import 'quill/dist/quill.snow.css';
  
import { debounceTime, Subject, distinctUntilChanged, filter, retry, EMPTY } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { RichTextService, AnotacaoConteudoDTO } from '../../services/rich-text/rich-text.service';  

@Component({   
  selector: 'app-rich-text',   
  standalone: true,   
  templateUrl: `./rich-text.component.html`,   
  styleUrls: ['./rich-text.component.css'],   
  encapsulation: ViewEncapsulation.None, 
}) 
export class RichTextComponent implements OnInit, OnDestroy, OnChanges {   
  @Input() habilitado: boolean = true;
  @Input() conteudo: string = '';
  @Input() idAnotacao: number | null = null;
  @Output() conteudoSalvo = new EventEmitter<{
    conteudoResult: AnotacaoConteudoDTO, 
    titulo?: string, 
    dataUltimaAlteracao?: string
  }>();

  private editor: Quill | null = null;   
  private conteudoSubject = new Subject<string>();   
  private destroy$ = new Subject<void>();
  private ultimoConteudoSalvo: string | null = null;
  private ultimoTituloSalvo: string | null = null;

  constructor(private richTextService: RichTextService) {}    

  ngOnInit() {     
    const toolbarOptions = [       
      [{ header: [1, 2, 3, 4, 5] }, { font: [] }],       
      [{ list: 'ordered' }, { list: 'bullet' }],       
      ['bold', 'italic', 'underline', 'strike'],       
      [{ align: [] }],       
      ['link', 'image'],       
      ['blockquote', 'code-block'],     
    ];      

    this.editor = new Quill('#editor', {       
      theme: 'snow',       
      modules: { toolbar: toolbarOptions },       
      placeholder: 'Comece a escrever...',       
      bounds: '#editor',     
      
    });      

    this.editor.enable(this.habilitado);
    
    this.configurarSalvamentoAutomatico();

    if (this.conteudo) {
      this.carregarConteudo(this.conteudo);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['idAnotacao'] && !changes['idAnotacao'].firstChange) {
      this.resetarEditor();
    }

    if (changes['conteudo'] && this.editor) {
      this.carregarConteudo(changes['conteudo'].currentValue);
    }
    if (changes['habilitado'] && this.editor) {
      this.atualizarEstadoEditor();
  }
    
  }
    private atualizarEstadoEditor() {
      if (this.editor) {
        this.editor.enable(this.habilitado);
        
        this.editor.root.setAttribute(
          'data-placeholder', 
          this.habilitado ? 'Comece a escrever...' : 'Nenhuma atividade selecionada'
        );
      }
    }


  private resetarEditor() {
    if (this.editor) {
      this.editor.setText('');
      this.editor.format('header', 1);
      this.ultimoConteudoSalvo = null;
      this.ultimoTituloSalvo = null;
    }
  }

  private carregarConteudo(conteudo: any): void {
    if (this.editor) {
      try {
        const conteudoParaProcessar = Array.isArray(conteudo) 
          ? (conteudo.length > 0 ? conteudo[0].conteudo : null) 
          : conteudo;
    
        if (conteudoParaProcessar) {
          const parsedContent = typeof conteudoParaProcessar === 'string' 
            ? JSON.parse(conteudoParaProcessar) 
            : conteudoParaProcessar;
    
          if (parsedContent && parsedContent.ops && Array.isArray(parsedContent.ops)) {
            this.editor.setContents(parsedContent);
            
            const length = this.editor.getLength();
            this.editor.setSelection(length, 0);

            this.ultimoConteudoSalvo = JSON.stringify(parsedContent);
          } else {
            console.error('Conteúdo inválido', parsedContent);
            this.editor.setText('Erro ao carregar conteúdo.');
          }
        } else {
          console.warn('Nenhum conteúdo encontrado');
          this.editor.setText('');
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        this.editor.setText('Erro ao carregar conteúdo.');
      }
    }
  }
  
  private configurarSalvamentoAutomatico() {
    this.editor?.on('text-change', () => {
      const conteudo = JSON.stringify(this.editor?.getContents()); 
      this.conteudoSubject.next(conteudo);
    });

    this.conteudoSubject
      .pipe(
        debounceTime(1500),
        distinctUntilChanged(),
        filter(conteudo => this.isConteudoAlterado(conteudo)),
        takeUntil(this.destroy$)
      )
      .subscribe(conteudo => {
        this.salvarConteudo(conteudo);
      });
  }

  private isConteudoAlterado(novoConteudo: string): boolean {
    return this.ultimoConteudoSalvo !== novoConteudo;
  }

  private salvarConteudo(conteudo: string) {
    if (this.idAnotacao) {
      const request: AnotacaoConteudoDTO = {
        conteudo: conteudo,
        anotacaoId: this.idAnotacao
      };

      const primeiraLinha = this.extrairPrimeiraLinha(conteudo);

      if (this.ultimoConteudoSalvo !== conteudo || this.ultimoTituloSalvo !== primeiraLinha) {
        this.richTextService.salvarConteudoAnotacao(request)
          .pipe(
            takeUntil(this.destroy$),
            retry(2),
            catchError(error => {
              console.error('Erro persistente ao salvar:', error);
              return EMPTY;
            })
          )
          .subscribe({
            next: (resposta) => {
              console.log('Conteúdo salvo com sucesso:', resposta);
              
              this.ultimoConteudoSalvo = conteudo;
              this.ultimoTituloSalvo = primeiraLinha;
              
              this.conteudoSalvo.emit({
                conteudoResult: resposta,
                titulo: primeiraLinha,
                dataUltimaAlteracao: this.formatarData(new Date())
              });
            },
            error: (erro) => {
              console.error('Erro ao salvar conteúdo:', erro);
            },
          });
      }
    } else {
      console.warn('ID da anotação não encontrado. Conteúdo não será salvo.');
    }
  }

  private extrairPrimeiraLinha(conteudo: string): string {
    try {
      const parsedContent = JSON.parse(conteudo);
      if (parsedContent.ops && parsedContent.ops.length > 0) {
        const primeiraLinha = parsedContent.ops
          .find((op: any) => op.insert && typeof op.insert === 'string')
          ?.insert.split('\n')[0]
          .trim();
        
        return primeiraLinha || 'Nova Anotação';
      }
    } catch (error) {
      console.error('Erro ao extrair primeira linha:', error);
    }
    return 'Nova Anotação';
  }

  ngOnDestroy() {     
    this.destroy$.next();     
    this.destroy$.complete();   
  }
  
  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${hora}:${minutos}`;
  }
}