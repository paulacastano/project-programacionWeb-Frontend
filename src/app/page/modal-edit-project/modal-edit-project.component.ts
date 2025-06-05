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
  selector: 'app-modal-edit-project',
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
  templateUrl: './modal-edit-project.component.html',
  styleUrl: './modal-edit-project.component.scss',
})
export class ModalEditProjectComponent {
  formEditProject!: FormGroup;
  searchControl = new FormControl();
  filteredOptions: Array<{ nombre: string; id: number }> = [];
  userDefaultFilterSearch: any = {
    nombre: undefined,
  };

  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<ModalEditProjectComponent>,
    private usersService: UsersService,
    private projectService: ProjectsService,
    private readonly _snackBar: MatSnackBar
  ) {
    this.editFormProject();
  }

  ngOnInit() {
    this.handleProjectAdministratorChange();
    if (this.data) {
      this.loadProjectData(this.data);
    }
  }

  loadProjectData(project: any) {
    this.formEditProject.patchValue({
      id: project.id,
      nombre: project.nombre,
      descripcion: project.descripcion,
      administrator_id: project.administrator_id,
    });
  }

  onSubmit() {
    if (this.formEditProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    const projectDataInformation = {
      id: this.formEditProject.get('id')?.value,
      nombre: this.formEditProject.get('nombre')?.value,
      descripcion: this.formEditProject.get('descripcion')?.value,
      administrador_id: this.formEditProject.get('administrador_id')?.value,
    };

    this.projectService.updateProject(projectDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.formEditProject.reset();
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
    this.formEditProject.get('administrador_id')?.setValue(id);
  }

  editFormProject() {
    this.formEditProject = this._formBuilder.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]],
      administrador_id: [null],
    });
  }
}
