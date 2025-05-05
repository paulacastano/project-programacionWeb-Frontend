import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from 'app/services/users/users.service';
import { ModalCreateUsersComponent } from '../modal-create-users/modal-create-users.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditUsersComponent } from '../modal-edit-users/modal-edit-users.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

export interface User {
  name: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatOptionModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    MatAutocompleteModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];

  breadcrumbs = [
    { title: 'Gestión de Usuarios', items: [], active: 'Datos básicos' },
  ];

  breadcrumbsDetails = [{ title: '' }];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  userFormSearchFilter!: FormGroup;
  usersList: any[] = [];

  isLoading = false;

  userDefaultFilterSearch: any = {
    name: undefined,
    email: undefined,
  };

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly userService: UsersService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createFormSearchFilter();
    this.getAllUsersByAdministrator();
    this.handleUserFilterChange('name', 'name');
    this.handleUserFilterChange('email', 'email');
  }

  createFormSearchFilter(): void {
    this.userFormSearchFilter = this._formBuilder.group({
      name: [''],
      email: [''],
    });
  }

  handleUserFilterChange(controlName: string, filterField: string): void {
    this.userFormSearchFilter
      .get(controlName)
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.userDefaultFilterSearch[filterField] = value;
        this.getAllUsersByAdministrator({ ...this.userDefaultFilterSearch });
      });
  }

  getAllUsersByAdministrator(filter?: any): void {
    this.isLoading = true;
    this.userService.getAllUsersByAdministrator(filter).subscribe({
      next: (response) => {
        this.usersList = response.users;
        this.dataSource.data = response.users;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getRoleName(roleId: number): string {
    switch (roleId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuario';
      default:
        return 'Desconocido';
    }
  }

  openModalCreateUser(): void {
    const dialogRef = this.dialogModel.open(ModalCreateUsersComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsersByAdministrator();
      }
    });
  }

  openModalUpdateUser(userInformation: any): void {
    const dialogRef = this.dialogModel.open(ModalEditUsersComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
      data: userInformation,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsersByAdministrator();
      }
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        this._snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
          duration: 5000,
        });
        this.getAllUsersByAdministrator();
      },
      error: () => {
        this._snackBar.open('Error al eliminar el usuario', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }
}
