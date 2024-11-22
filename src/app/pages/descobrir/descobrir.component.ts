import { Component, OnInit } from '@angular/core';
import { MaterialService, MaterialReadDTO } from '../../services/materiais/materiais.service';
import { MenuPesquisaComponent } from "../../components/menu-pesquisa/menu-pesquisa.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-descobrir',
  standalone: true,
  imports: [MenuPesquisaComponent, CommonModule],
  templateUrl: './descobrir.component.html',
  styleUrls: ['./descobrir.component.css']
})
export class DescobrirComponent implements OnInit {

  materiais: MaterialReadDTO[] = [];

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    this.carregarMateriaisPublicos();
  }

  carregarMateriaisPublicos(): void {
    this.materialService.listarMateriaisPublicos().subscribe(
      (materiais) => {
        this.materiais = materiais;
      },
      (error) => {
        console.error('Erro ao carregar materiais públicos:', error);
      }
    );
  }
}
