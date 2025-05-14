import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';

@Component({
  // Decorador que indica que la clase es un componente
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  standalone: true,
})
export class SigninComponent implements OnInit {
  // Componente de inicio de sesión
  authForm!: UntypedFormGroup; // Formulario reactivo para la autenticación
  submitted = false; // Estado para saber si el formulario fue enviado
  loading = false; // Estado para gestionar el proceso de carga
  returnUrl!: string; // URL a la que redirigir después de iniciar sesión
  error = ''; // Mensaje de error en caso de fallos en la autenticación
  hide = true; // Control para ocultar/mostrar la contraseña

  email = ''; // Variable para almacenar el correo electrónico
  password = ''; // Variable para almacenar la contraseña

  constructor(
    // Constructor que inyecta los servicios necesarios
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    // Método que se ejecuta al inicializar el componente
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    // Método que devuelve los controles del formulario
    return this.authForm.controls;
  }

  onSubmit() {
    // Método que se ejecuta al enviar el formulario
    this.submitted = true;
    this.error = '';

    if (this.authForm.invalid) {
      Swal.fire('Error', 'Usuario y contraseña no válidos.', 'error');
      return;
    }

    this.authService // Servicio de autenticación
      .login(
        this.authForm.get('username')?.value,
        this.authForm.get('password')?.value
      )
      .subscribe({
        next: (res) => {
          if (res?.token) {
            // Guardar el token
            sessionStorage.setItem('accessToken', res.token);

            // Mostrar en consola para depuración
            console.log('Token recibido:', res.token);

            // Actualizar el usuario en AuthService
            this.authService.setToken(res.token);

            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: 'Redirigiendo al dashboard...',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/dashboard/main']);
            });
          } else {
            Swal.fire('Error', 'Credenciales incorrectas.', 'error');
          }
        },
        error: (error) => {
          this.submitted = false;
          this.loading = false;
          Swal.fire(
            'Error en el inicio de sesión',
            error.error?.message || 'Error desconocido',
            'error'
          );
        },
      });
  }
}
