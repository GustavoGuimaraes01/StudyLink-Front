import { Component } from '@angular/core';
import { RichTextEditorModule, ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { registerLicense } from '@syncfusion/ej2-base';

// Registrar a licença do Syncfusion
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF1cX2hIfEx3Qnxbf1x0ZFRMZF1bRnBPMyBoS35RckRiWHhccHZTQmRYWUFz');

// Carregar os dados CLDR para o Brasil (pt-BR)
import { loadCldr } from '@syncfusion/ej2-base';
import ptNumberData from '@syncfusion/ej2-cldr-data/main/pt/numbers.json';
import ptTimeZoneData from '@syncfusion/ej2-cldr-data/main/pt/timeZoneNames.json';
import ptGregorian from '@syncfusion/ej2-cldr-data/main/pt/ca-gregorian.json';
import ptNumberingSystem from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import { L10n } from '@syncfusion/ej2-base';

// Carregar os dados CLDR para o Brasil
loadCldr(ptNumberData, ptTimeZoneData, ptGregorian, ptNumberingSystem);

// Carregar as traduções para os componentes do Syncfusion
L10n.load({
  'pt': {
    'richTextEditor': {
      'link': 'Link',
      'image': 'Imagem',
      'table': 'Tabela',
      'insertLink': 'Inserir Link',
      'editLink': 'Editar Link',
      'unlink': 'Remover Link',
      'createTable': 'Criar Tabela',
      'insertImage': 'Inserir Imagem',
      'align': 'Alinhar',
      'undo': 'Desfazer',
      'redo': 'Refazer',
      'bold': 'Negrito',
      'italic': 'Itálico',
      'underline': 'Sublinhado',
      'fontColor': 'Cor da Fonte',
      'backgroundColor': 'Cor de Fundo',
      'clearFormatting': 'Limpar Formatação',
      'addImage': 'Adicionar Imagem',
      'selectImage': 'Selecionar Imagem',
      'openLink': 'Abrir Link',
      'removeImage': 'Remover Imagem'
    }
  }
});

@Component({
  selector: 'app-rich-text',
  standalone: true,
  imports: [RichTextEditorModule],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, TableService],
  template: `
    <div class="rich-text-container">
      <ejs-richtexteditor 
        [toolbarSettings]="toolbarSettings"
        [quickToolbarSettings]="quickToolbarSettings"
        enableResize="true"
        height="100%"
        width="100%"
        locale="pt"
        placeholder="Comece a digitar..."
        cssClass="notion-editor">
      </ejs-richtexteditor>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .rich-text-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 2rem;
      background-color: #fafafa;
      box-sizing: border-box;
    }
    .notion-editor .e-content {
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      line-height: 1.8;
    }
    .notion-editor .e-toolbar {
      border-bottom: 1px solid #ddd;
    }
  `]
})
export class RichTextComponent {
  public toolbarSettings = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|',
      'CreateLink', 'Image', 'CreateTable', '|',
      'ClearFormat', 'SourceCode', '|', 'Undo', 'Redo'
    ]
  };

  public quickToolbarSettings = {
    image: ['Replace', 'Align', 'Caption', 'Remove', 'InsertLink', 'OpenImageLink', '-', 'EditImage', 'AltText', 'Dimension'],
    link: ['Open', 'Edit', 'UnLink']
  };
}
