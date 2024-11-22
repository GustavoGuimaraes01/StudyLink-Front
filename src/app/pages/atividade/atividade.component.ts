import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RichTextComponent } from '../../components/rich-text/rich-text.component';

@Component({
  selector: 'app-atividade',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RichTextComponent],
  templateUrl: './atividade.component.html',
  styleUrls: ['./atividade.component.css']
})
export class AtividadeComponent {
  private isResizing = false;
  private startX = 0;
  private startWidth = 0;

  onResizeStart(event: MouseEvent, menuSecundario: HTMLElement): void {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = menuSecundario.offsetWidth;

    const onMove = (moveEvent: MouseEvent) => this.onResizeMove(menuSecundario, moveEvent);

    document.addEventListener('mousemove', onMove);

    const onMouseUp = () => {
      this.onResizeEnd(onMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mouseup', onMouseUp);
  }

  onResizeMove(menuSecundario: HTMLElement, event: MouseEvent): void {
    if (this.isResizing) {
      const diff = event.clientX - this.startX;
      const newWidth = this.startWidth + diff;
      menuSecundario.style.width = `${newWidth}px`;
    }
  }

  onResizeEnd(onMove: (event: MouseEvent) => void): void {
    this.isResizing = false;
    document.removeEventListener('mousemove', onMove);
  }
}
