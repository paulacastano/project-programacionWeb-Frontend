import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-modal-create-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './modal-create-users.component.html',
  styleUrls: ['./modal-create-users.component.scss'],
})
export class ModalCreateUsersComponent implements OnInit {
  formCreateUser!: FormGroup;
  administrators: any[] = [];
  showFielAdministrator: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _usersService: UsersService,
    private readonly dialogRef: MatDialogRef<ModalCreateUsersComponent>,
    private readonly _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createFormUser();
    this.getAllAdministrator();
    this.watchPasswordConfirmation();
  }

  createFormUser() {
    this.formCreateUser = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      rol_id: ['', Validators.required],
      administrador_id: [null],
    });
  }

  watchPasswordConfirmation() {
    this.formCreateUser
      .get('confirmPassword')
      ?.valueChanges.pipe(debounceTime(300))
      .subscribe((value) => this.validatePassword(value));
  }

  private validatePassword(confirmPassword: string) {
    const password = this.formCreateUser.get('password')?.value;
    if (password !== confirmPassword) {
      this.formCreateUser.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      this.formCreateUser.get('confirmPassword')?.setErrors(null);
    }
  }

  getAllAdministrator() {
    this._usersService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administrators = res.data;
      },
      error: (err) => {
        this._snackBar.open('Error al cargar los administradores', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  onChangeRole(event: any) {
    if (event.value === '1') {
      this.hideAdministratorField();
    } else {
      this.showAdministratorField();
    }
  }

  private hideAdministratorField() {
    this.showFielAdministrator = false;
    this.formCreateUser.get('administrador_id')?.clearValidators();
    this.formCreateUser.get('administrador_id')?.updateValueAndValidity();
  }

  private showAdministratorField() {
    this.showFielAdministrator = true;
    this.formCreateUser
      .get('administrador_id')
      ?.setValidators([Validators.required]);
    this.formCreateUser.get('administrador_id')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.formCreateUser.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    const userDataInformation = {
      nombre: this.formCreateUser.get('nombre')?.value,
      email: this.formCreateUser.get('email')?.value,
      password: this.formCreateUser.get('password')?.value,
      rol_id: Number(this.formCreateUser.get('rol_id')?.value),
      administrador_id: this.formCreateUser.get('administrador_id')?.value,
    };

    this._usersService.createUser(userDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.formCreateUser.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage =
          error?.result ||
          'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      },
    });
  }
}
