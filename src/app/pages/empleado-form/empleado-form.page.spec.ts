import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpleadoFormPage } from './empleado-form.page';

describe('EmpleadoFormPage', () => {
  let component: EmpleadoFormPage;
  let fixture: ComponentFixture<EmpleadoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
