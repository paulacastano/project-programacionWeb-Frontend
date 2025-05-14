// Este servicio es un guard de Angular que protege rutas de acceso solo para administradores.
// Verifica si el usuario tiene un rol de administrador antes de permitir el acceso a rutas protegidas.

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly _authService: AuthService,
    private readonly _router: Router
  ) {}

  // Método que determina si se puede acceder a la ruta solicitada
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userSession = this._authService.getAuthFromSessionStorage();
    console.log(userSession);

    // Si la sesión existe y el rol del usuario es de administrador (rol_id === 1)
    if (userSession && userSession.rol_id === 1) {
      return true;
      // Si no es administrador, redirige a la página 404 de autenticación
    } else {
      this._router.navigate(['/authentication/page404']);
      return false;
    }
  }
}
