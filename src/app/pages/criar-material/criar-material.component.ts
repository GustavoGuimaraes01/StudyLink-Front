// criar-material.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MateriaisService, Material } from '../../services/materiais/materiais.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectionList } from '@angular/material/list';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-criar-material',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatFormField, MatLabel , MatOption, MatSelectModule], 
  templateUrl: './criar-material.component.html',
  styleUrls: ['./criar-material.component.css']
})
export class CriarMaterialComponent implements OnInit {
  @Input() isOpen = false;
  @Input() materialParaEditar: Material | null = null;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() materialSalvo = new EventEmitter<void>();

  material: Material = {
    imagemBanner: '',
    titulo: '',
    areaConhecimento: '',
    visibilidade: 'PUBLICO'
  };

  selectedImage: string | ArrayBuffer | null = null;

  constructor(private materiaisService: MateriaisService) {}

  ngOnInit() {
    if (this.materialParaEditar) {
      this.material = { ...this.materialParaEditar };
      this.selectedImage = this.materialParaEditar.imagemBanner;
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
          this.material.imagemBanner = this.selectedImage;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.material.imagemBanner = '';
  }

 // criar-material.component.ts
 salvar() {
  if (this.validarFormulario()) {
    if (this.materialParaEditar?.id) {
      this.materiaisService.atualizarMaterial(this.materialParaEditar.id, this.material).subscribe({
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
      this.materiaisService.criarMaterial(this.material).subscribe({
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
              this.material.areaConhecimento && 
              this.material.imagemBanner && 
              this.material.visibilidade);
  }
  
  private resetForm() {
    this.material = {
      imagemBanner: '',
      titulo: '',
      areaConhecimento: '',
      visibilidade: 'PUBLICO'
    };
    this.selectedImage = null;
  }
}