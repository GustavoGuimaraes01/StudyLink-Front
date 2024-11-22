// criar-material.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService, Material } from '../../services/materiais/materiais.service';

@Component({
  selector: 'app-criar-material',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './criar-material.component.html',
  styleUrls: ['./criar-material.component.css']
})
export class CriarMaterialComponent implements OnInit {
  @Input() isOpen = false;
  @Input() materialParaEditar: Material | null = null;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() materialSalvo = new EventEmitter<void>();

  material: Material = {
    imagem_banner: '',
    titulo: '',
    area_conhecimento: '',
    visibilidade: 'publica'
  };

  selectedImage: string | ArrayBuffer | null = null;

  constructor(private materialService: MaterialService) {}

  ngOnInit() {
    if (this.materialParaEditar) {
      this.material = { ...this.materialParaEditar };
      this.selectedImage = this.materialParaEditar.imagem_banner;
    }
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
    this.resetForm();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
        if (typeof this.selectedImage === 'string') {
          this.material.imagem_banner = this.selectedImage;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.material.imagem_banner = '';
  }

  salvar() {
    if (this.validarFormulario()) {
      if (this.materialParaEditar?.id) {
        // Atualizar material existente
        this.materialService.atualizarMaterial(this.materialParaEditar.id, this.material).subscribe({
          next: () => {
            this.materialSalvo.emit();
            this.close();
          },
          error: (error) => {
            console.error('Erro ao atualizar material:', error);
          }
        });
      } else {
        // Criar novo material
        this.materialService.criarMaterial(this.material).subscribe({
          next: () => {
            this.materialSalvo.emit();
            this.close();
          },
          error: (error) => {
            console.error('Erro ao criar material:', error);

          }
        });
      }
    }
  }

  private validarFormulario(): boolean {
    return !!(this.material.titulo && 
              this.material.area_conhecimento && 
              this.material.imagem_banner);
  }

  private resetForm() {
    this.material = {
      imagem_banner: '',
      titulo: '',
      area_conhecimento: '',
      visibilidade: 'publica'
    };
    this.selectedImage = null;
  }
}