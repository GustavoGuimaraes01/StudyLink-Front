import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { LoginServiceService } from '../../services/usuarios/login-service.service';

@Component({
  selector: 'app-image-upload-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './image-upload-dialog.component.html',
  styleUrls: ['./image-upload-dialog.component.css']
})
export class ImageUploadDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ImageUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentImageUrl: string | null }, 
    private loginService: LoginServiceService 
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreview = null; 
    }
  }

  onUploadImage(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
  
        this.loginService.atualizarImagemPerfil(base64Image).subscribe({
          next: () => {
            sessionStorage.setItem('profileImageUrl', base64Image); // Salva a imagem no sessionStorage
            alert('Imagem de perfil atualizada com sucesso!');
            this.dialogRef.close(base64Image); // Retorna a URL da imagem ao fechar o diálogo
          },
          error: (err) => alert(`Erro ao atualizar imagem: ${err.message}`),
        });
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      alert('Por favor, selecione um arquivo para enviar.');
    }
  }
  

  onCancel() {
    this.dialogRef.close();
  }
}