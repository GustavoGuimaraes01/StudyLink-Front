import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescobrirComponent } from './descobrir.component';

describe('DescobrirComponent', () => {
  let component: DescobrirComponent;
  let fixture: ComponentFixture<DescobrirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescobrirComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescobrirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
