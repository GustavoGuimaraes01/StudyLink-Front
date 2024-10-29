import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-criar-material',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './criar-material.component.html',
  styleUrls: ['./criar-material.component.css']
})
export class CriarMaterialComponent {
  @Input() isOpen = false; // Recebe o estado do componente pai
  @Output() isOpenChange = new EventEmitter<boolean>(); // Emite eventos para o componente pai

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen); // Atualiza o estado no componente pai
  }

  selectedImage: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
  }
}

