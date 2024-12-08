  import { Component, ViewEncapsulation, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'; 
  import Quill from 'quill'; 
  import 'quill/dist/quill.snow.css'; 
  import { debounceTime, Subject } from 'rxjs';
  import { takeUntil } from 'rxjs/operators';
  import { RichTextService, AnotacaoConteudoDTO } from '../../services/rich-text/rich-text.service';  

  @Component({   
    selector: 'app-rich-text',   
    standalone: true,   
    templateUrl: `./rich-text.component.html`,   
    styleUrls: ['./rich-text.component.css'],   
    encapsulation: ViewEncapsulation.None, 
  }) 
  export class RichTextComponent implements OnInit, OnDestroy, OnChanges {   
    @Input() conteudo: string = '';
    @Input() idAnotacao: number | null = null;
    @Output() conteudoSalvo = new EventEmitter<AnotacaoConteudoDTO>();

    private editor: Quill | null = null;   
    private conteudoSubject = new Subject<string>();   
    private destroy$ = new Subject<void>();   

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

      // Configurar salvamento automático
      this.configurarSalvamentoAutomatico();

      // Se já existe conteúdo, carregar no editor
      if (this.conteudo) {
        this.carregarConteudo(this.conteudo);
      }
    }

    ngOnChanges(changes: SimpleChanges) {
      // Quando o ID da anotação muda, resetar o editor
      if (changes['idAnotacao'] && !changes['idAnotacao'].firstChange) {
        this.resetarEditor();
      }

      // Carregar novo conteúdo quando ele mudar
      if (changes['conteudo'] && this.editor) {
        this.carregarConteudo(changes['conteudo'].currentValue);
      }
    }

    private resetarEditor() {
      if (this.editor) {
        this.editor.setText('');
        this.editor.format('header', 1);
      }
    }

    private carregarConteudo(conteudo: any): void {
      if (this.editor) {
        try {
          // Se for uma lista, pegue o primeiro item
          const conteudoParaProcessar = Array.isArray(conteudo) 
            ? (conteudo.length > 0 ? conteudo[0].conteudo : null) 
            : conteudo;
    
          if (conteudoParaProcessar) {
            // Tenta parsear o conteúdo
            const parsedContent = typeof conteudoParaProcessar === 'string' 
              ? JSON.parse(conteudoParaProcessar) 
              : conteudoParaProcessar;
    
            // Verifica se o conteúdo tem o formato esperado pelo Quill
            if (parsedContent && parsedContent.ops && Array.isArray(parsedContent.ops)) {
              this.editor.setContents(parsedContent);
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
    // Verifique a existência de `this.editor`
    this.editor?.on('text-change', () => {
      const conteudo = JSON.stringify(this.editor?.getContents()); // Evite acessar se for undefined
      this.conteudoSubject.next(conteudo);
    });

    this.conteudoSubject
      .pipe(
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe(conteudo => {
        this.salvarConteudo(conteudo);
      });
  }
    

  private salvarConteudo(conteudo: string) {
    // Só salva se tiver um ID de anotação
    if (this.idAnotacao) {
      const request: AnotacaoConteudoDTO = {
        conteudo: conteudo,
        anotacaoId: this.idAnotacao
      };

      // Logando o conteúdo antes de enviar para a API
      console.log('Conteúdo que será enviado:', conteudo);
      console.log('Request completo:', request);

      this.richTextService.salvarConteudoAnotacao(request)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resposta) => {
            // Logando a resposta da API
            console.log('Conteúdo salvo com sucesso:', resposta);
            this.conteudoSalvo.emit(resposta);
          },
          error: (erro) => {
            // Logando o erro da API
            console.error('Erro ao salvar conteúdo:', erro);
          },
        });
    } else {
      console.warn('ID da anotação não encontrado. Conteúdo não será salvo.');
    }
  }


    ngOnDestroy() {     
      this.destroy$.next();     
      this.destroy$.complete();   
    }  
  }