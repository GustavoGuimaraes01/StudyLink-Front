import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarMaterialComponent } from './criar-material.component';

describe('CriarMaterialComponent', () => {
  let component: CriarMaterialComponent;
  let fixture: ComponentFixture<CriarMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
