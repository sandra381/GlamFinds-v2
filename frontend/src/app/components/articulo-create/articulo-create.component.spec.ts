import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloCreateComponent } from './articulo-create.component';

describe('ArticuloCreateComponent', () => {
  let component: ArticuloCreateComponent;
  let fixture: ComponentFixture<ArticuloCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticuloCreateComponent]
    });
    fixture = TestBed.createComponent(ArticuloCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
