import { Component, ViewEncapsulation } from '@angular/core';
import Quill from 'quill';
import { QuillModule } from 'ngx-quill';

// Adicione o estilo do Quill
import 'quill/dist/quill.snow.css';

@Component({
  selector: 'app-rich-text',
  template: `
    <div class="rich-text-container">
      <div id="editor"></div>
      
    </div>
  `,
  styleUrls: ['./rich-text.component.css'],  
  encapsulation: ViewEncapsulation.None, 
})
export class RichTextComponent {
  private editor: any;
  private isFirstLine: boolean = true;

  ngOnInit() {
    // Inicializando o Quill
    const toolbarOptions = [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      ['link', 'image'],
      ['blockquote', 'code-block']
    ];

    this.editor = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Comece a digitar...',
      bounds: '#editor',
    });

    // Detecta quando o usuário começa a digitar
    this.editor.on('text-change', (delta: any, oldDelta: any, source: string) => {
      if (this.isFirstLine) {
        // Detecta o texto na primeira linha
        const firstLineText = this.editor.getText(0, this.editor.getLength()).trim();

        // Verifica se a primeira linha não está vazia
        if (firstLineText !== '') {
          // Aplica o título e centraliza somente a primeira linha
          this.editor.formatText(0, firstLineText.length, 'header', 1);  // Header 1
          this.editor.formatText(0, firstLineText.length, 'align', 'center'); // Centraliza o texto

          // Impede que o título seja aplicado novamente
          this.isFirstLine = false;
        }
      }
    });
  }
}
