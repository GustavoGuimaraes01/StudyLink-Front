import { Component } from '@angular/core';
import { BarraComponent } from "../../components/barra/barra.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nao-encontrada',
  standalone: true,
  imports: [BarraComponent,CommonModule],
  templateUrl: './nao-encontrada.component.html',
  styleUrl: './nao-encontrada.component.css'
})
export class NaoEncontradaComponent {
}
