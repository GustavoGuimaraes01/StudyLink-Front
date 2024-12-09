import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialPublicoComponent } from './material-publico.component';

describe('MaterialPublicoComponent', () => {
  let component: MaterialPublicoComponent;
  let fixture: ComponentFixture<MaterialPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialPublicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
