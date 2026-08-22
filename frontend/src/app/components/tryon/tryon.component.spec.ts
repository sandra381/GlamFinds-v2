import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryonComponent } from './tryon.component';

describe('TryonComponent', () => {
  let component: TryonComponent;
  let fixture: ComponentFixture<TryonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TryonComponent]
    });
    fixture = TestBed.createComponent(TryonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
