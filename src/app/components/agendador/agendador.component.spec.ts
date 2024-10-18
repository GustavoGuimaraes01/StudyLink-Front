import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendadorComponent } from './agendador.component';

describe('AgendadorComponent', () => {
  let component: AgendadorComponent;
  let fixture: ComponentFixture<AgendadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
