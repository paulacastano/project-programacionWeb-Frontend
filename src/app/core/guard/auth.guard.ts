import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../service/auth.service';

@Injectable({
  //Decorador que indica que la clase es un servicio
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private readonly authService: AuthService) {} //Constructor que inyecta el servicio AuthService

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //
    const currentUser = this.authService.isAuthenticated();
    if (currentUser) {
      return true;
    }

    // // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
