import { Route } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { Page404Component } from './page404/page404.component';

/// Definición del arreglo de rutas (rutas de autenticación)
export const AUTH_ROUTE: Route[] = [
  {
    path: '', // Ruta vacía: Redirige a la ruta 'signin' de forma predeterminada
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  {
    // Ruta para el componente de inicio de sesión
    path: 'signin',
    component: SigninComponent,
  },
  {
    // Ruta para la página de error 404
    path: 'page404',
    component: Page404Component,
  },
  // Ruta comodín: Redirige a la página 404 si no se encuentra la ruta solicitada
  { path: '**', redirectTo: 'page404', pathMatch: 'full' },
];
