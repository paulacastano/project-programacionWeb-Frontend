import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'app-modal-edit-users',
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
  templateUrl: './modal-edit-users.component.html',
  styleUrls: ['./modal-edit-users.component.scss'],
})
export class ModalEditUsersComponent implements OnInit {
  formUpdateUser!: FormGroup;
  administratorsValues: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _usersService: UsersService,
    private readonly _snackBar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<ModalEditUsersComponent>
  ) {
    this.updateFormUser();
    this.getAllAdministrator();
  }

  ngOnInit() {
    if (this.data?.user) {
      this.loadUserData(this.data.user);
    }
  }

  updateFormUser() {
    this.formUpdateUser = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol_id: ['', Validators.required],
      administrator_id: ['', Validators.required],
    });
  }

  loadUserData(user: any) {
    this.formUpdateUser.patchValue({
      nombre: user.nombre,
      email: user.email,
      rol_id: user.rol_id,
      administrator_id: user.administrator_id,
    });
  }

  getAllAdministrator() {
    this._usersService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administratorsValues = res.users;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateUser() {
    if (this.formUpdateUser.valid) {
      const userData = this.formUpdateUser.value;
      const userId = this.data.user?.id;

      this._usersService.updateUser(userId, userData).subscribe({
        next: (response) => {
          this._snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
            duration: 5000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          const errorMessage =
            error.error?.result ||
            'Error al actualizar el usuario. Por favor, inténtelo de nuevo.';
          this._snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
          });
        },
      });
    }
  }
}
