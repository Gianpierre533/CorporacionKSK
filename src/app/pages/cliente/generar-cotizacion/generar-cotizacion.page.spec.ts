import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarCotizacionPage } from './generar-cotizacion.page';

describe('GenerarCotizacionPage', () => {
  let component: GenerarCotizacionPage;
  let fixture: ComponentFixture<GenerarCotizacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarCotizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
