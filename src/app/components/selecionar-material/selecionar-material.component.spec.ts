import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecionarMaterialComponent } from './selecionar-material.component';

describe('SelecionarMaterialComponent', () => {
  let component: SelecionarMaterialComponent;
  let fixture: ComponentFixture<SelecionarMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecionarMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecionarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
