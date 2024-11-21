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
  @Input() isOpen = false; 
  @Output() isOpenChange = new EventEmitter<boolean>(); 

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen); 
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

