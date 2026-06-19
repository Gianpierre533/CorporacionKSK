import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialCotizacionesPage } from './historial-cotizaciones.page';

describe('HistorialCotizacionesPage', () => {
  let component: HistorialCotizacionesPage;
  let fixture: ComponentFixture<HistorialCotizacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialCotizacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
