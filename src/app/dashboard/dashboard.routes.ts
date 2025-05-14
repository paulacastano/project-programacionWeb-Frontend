//// Rutas del módulo Dashboard. Define la ruta principal que carga el componente MainComponent.

import { Route } from '@angular/router';
import { MainComponent } from './main/main.component';

export const DASHBOARD_ROUTE: Route[] = [
  {
    path: 'main',
    component: MainComponent,
  },
];
