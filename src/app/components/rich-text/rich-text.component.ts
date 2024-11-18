import { Component, ViewEncapsulation } from '@angular/core';
import Quill from 'quill';

// Adicione o estilo do Quill
import 'quill/dist/quill.snow.css';

@Component({
  selector: 'app-rich-text',
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
      placeholder: 'Digite aqui...',
      bounds: '#editor',
    });

  }
}
