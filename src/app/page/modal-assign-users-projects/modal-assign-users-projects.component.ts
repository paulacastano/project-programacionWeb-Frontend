//// Componente para la asignación de usuarios a proyectos. Gestiona la interfaz modal para seleccionar y asignar usuarios a proyectos.
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from 'app/services/users/users.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectsService } from 'app/services/projects/projects.service';

@Component({
  selector: 'app-modal-assign-users-projects',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './modal-assign-users-projects.component.html',
  styleUrl: './modal-assign-users-projects.component.scss',
})
export class ModalAssignUsersProjectsComponent {
  displayedColumns: string[] = ['isSelected', 'name', 'email'];
  showFieldAdministrator: boolean = false;
  isLoading: boolean = false;
  checkedUsers: any = {};

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public projectId: string,
    private readonly _usersService: UsersService,
    private readonly projectsService: ProjectsService,
    private readonly dialogRef: MatDialogRef<ModalAssignUsersProjectsComponent>,
    private readonly _snackBar: MatSnackBar
  ) {
    console.log(this.projectId);
  }

  ngOnInit() {
    this.getAllUsersByAdministrator();
  }

  checkUserId(userId: string, event: { checked: boolean }) {
    this.checkedUsers[userId] = event.checked;
  }

  getUserCheckStatus(userId: string) {
    if (userId in this.checkedUsers) {
      return this.checkedUsers[userId];
    }
    return false;
  }

  getAllUsersByAdministrator(): void {
    this.isLoading = true;
    this._usersService.getAllUsersByAdministrator().subscribe({
      next: (response) => {
        // this.usersList = response.users;
        this.dataSource.data = response.users;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  checkAllUsers() {}

  onSubmit() {
    const userIds = this.dataSource.data
      .filter((user) => this.checkedUsers[user.id])
      .map((user) => user.id);
    userIds.forEach((userId) => {
      this.projectsService
        .associateUserToProject(userId, Number(this.projectId))
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error) => {
            this._snackBar.open('Error al asignar usuario');
          },
        });
    });
  }
}
