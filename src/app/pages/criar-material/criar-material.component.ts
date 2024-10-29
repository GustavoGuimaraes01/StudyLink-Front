import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MateriasComponent } from '../materias/materias.component';


@Component({
  selector: 'app-criar-material',
  standalone: true,
  imports: [MateriasComponent],
  templateUrl: './criar-material.component.html',
  styleUrl: './criar-material.component.css',
  encapsulation: ViewEncapsulation.None, 
})
export class CriarMaterialComponent {
  constructor(private dialogRef: MatDialogRef<CriarMaterialComponent>) {}

  close() {
    this.dialogRef.close();
    
  }
}
