import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmpleadoListPage } from './empleado-list.page';

describe('EmpleadoListPage', () => {
  let component: EmpleadoListPage;
  let fixture: ComponentFixture<EmpleadoListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpleadoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
