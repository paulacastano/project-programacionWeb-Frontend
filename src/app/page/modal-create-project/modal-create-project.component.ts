//// Componente para la creación de proyectos. Gestiona la interfaz modal para ingresar los detalles de un nuevo proyecto.

import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { UsersService } from 'app/services/users/users.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProjectsService } from 'app/services/projects/projects.service';

@Component({
  selector: 'app-modal-create-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './modal-create-project.component.html',
  styleUrl: './modal-create-project.component.scss',
})
export class ModalCreateProjectComponent {
  formCreateProject!: FormGroup;
  searchControl = new FormControl();
  filteredOptions: Array<{ nombre: string; id: number }> = [];
  userDefaultFilterSearch: any = {
    nombre: undefined,
  };

  isLoading = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<ModalCreateProjectComponent>,
    private usersService: UsersService,
    private projectService: ProjectsService,
    private readonly _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.createFormProject();
    this.handleProjectAdministratorChange();
  }

  onSubmit() {
    if (this.formCreateProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    const projectDataInformation = {
      nombre: this.formCreateProject.get('nombre')?.value,
      descripcion: this.formCreateProject.get('descripcion')?.value,
      administrador_id: this.formCreateProject.get('administrador_id')?.value,
    };

    this.projectService.createProject(projectDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.formCreateProject.reset();
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

  handleProjectAdministratorChange() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          this.userDefaultFilterSearch['nombre'] = value;
          return this.usersService.getUsers({
            ...this.userDefaultFilterSearch,
          });
        })
      )
      .subscribe((data) => {
        this.filteredOptions = data.users;
      });
  }

  onChangeAdministratorRole(id: string) {
    this.formCreateProject.get('administrador_id')?.setValue(id);
  }

  createFormProject() {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
      administrador_id: [null],
    });
  }
}
