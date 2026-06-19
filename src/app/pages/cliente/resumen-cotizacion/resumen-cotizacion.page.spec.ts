import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenCotizacionPage } from './resumen-cotizacion.page';

describe('ResumenCotizacionPage', () => {
  let component: ResumenCotizacionPage;
  let fixture: ComponentFixture<ResumenCotizacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenCotizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
