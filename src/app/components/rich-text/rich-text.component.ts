import { Component, ViewEncapsulation } from '@angular/core';
import Quill from 'quill';

// Adicione o estilo do Quill
import 'quill/dist/quill.snow.css';

@Component({
  selector: 'app-rich-text',
  standalone: true,
  templateUrl: `./rich-text.component.html`,
  styleUrls: ['./rich-text.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RichTextComponent {
  private editor: any;

  ngOnInit() {
    const toolbarOptions = [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ align: [] }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
    ];

    this.editor = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
      placeholder: 'Título...',
      bounds: '#editor',
    });

    const quillEditor = document.querySelector('.ql-editor');

    if (quillEditor) {
      quillEditor.addEventListener('input', () => {
        const firstChild = quillEditor.firstChild;

        if (firstChild && firstChild.nodeType === Node.ELEMENT_NODE) {
          const firstChildTag = (firstChild as HTMLElement).tagName;
          // Se a primeira linha não for um título (H1), formate-a como um H1
          if (firstChildTag !== 'H1') {
            this.editor.formatLine(0, 1, 'header', 1); // Garante que a primeira linha seja H1
          }
        }
      });
    }
  }
}
