// Prueba unitaria para verificar que el componente Page404Component se crea correctamente
// y que se inicializa sin errores.
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Page404Component } from './page404.component';
describe('Page404Component', () => {
  let component: Page404Component;
  let fixture: ComponentFixture<Page404Component>;
  // Configura el entorno de pruebas antes de que se ejecuten los tests
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [Page404Component],
    }).compileComponents();
  }));

  // Crea una instancia del componente antes de cada prueba
  beforeEach(() => {
    fixture = TestBed.createComponent(Page404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verifica que el componente se haya creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
