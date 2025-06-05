import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProjectsService } from 'app/services/projects/projects.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalCreateProjectComponent } from '../modal-create-project/modal-create-project.component';
import { ModalEditProjectComponent } from '../modal-edit-project/modal-edit-project.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  displayedColumns: string[] = [
    'name',
    'description',
    'date',
    'total-users',
    'administrator',
    'actions',
  ];

  breadcrumbs = [
    {
      title: 'Gestión de proyectos',
      items: [],
      active: 'Listado de proyectos',
    },
  ];

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  projectFormSearchFilter!: FormGroup;
  projectsList: any[] = [];

  isLoading = false;

  projectDefaultFilterSearch: any = {
    name: undefined,
  };

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly projectsService: ProjectsService,
    private readonly dialogModel: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.createFormSearchFilter();
    this.getAllProjectsByUser();
    this.handleProjectFilterChange('name', 'name');
  }

  createFormSearchFilter() {
    this.projectFormSearchFilter = this._formBuilder.group({
      name: [''],
    });
  }

  handleProjectFilterChange(controlName: string, filterField: string): void {
    this.projectFormSearchFilter
      .get(controlName)
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.projectDefaultFilterSearch[filterField] = value;
        this.getAllProjectsByUser({ ...this.projectDefaultFilterSearch });
      });
  }

  getAllProjectsByUser(filter?: any) {
    this.isLoading = true;
    this.projectsService.getAllProjects(filter).subscribe({
      next: (response) => {
        this.projectsList = response.projects;
        this.dataSource.data = response.projects;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  deleteProject(projectId: string) {
    this.projectsService.deleteProject(projectId).subscribe({
      next: (response) => {
        this._snackBar.open('Proyecto eliminado correctamente', 'Cerrar', {
          duration: 5000,
        });
        this.getAllProjectsByUser();
      },
      error: () => {
        this._snackBar.open('Error al eliminar el proyecto', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  openModalCreateProject() {
    const dialogRef = this.dialogModel.open(ModalCreateProjectComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllProjectsByUser();
      }
    });
  }

  openModalUpdateProject(projectInformation: any) {
    const dialogRef = this.dialogModel.open(ModalEditProjectComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
      data: projectInformation,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllProjectsByUser();
      }
    });
  }

  verDetalle(projectId: string) {
    this.router.navigate(['page/projects/', projectId]);
  }
}
