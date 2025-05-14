// Aqui se define el componente de la página 404
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss'],
  standalone: true,
  imports: [FormsModule, MatButtonModule],
})
export class Page404Component {
  constructor(private _router: Router) {}

  // Método para redirigir al usuario a la página principal
  // cuando se hace clic en el botón "Volver al inicio"
  redirectHome() {
    this._router.navigate(['/dashboard/main']);
  }
}
