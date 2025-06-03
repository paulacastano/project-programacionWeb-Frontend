import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ProjectsService } from 'app/services/projects/projects.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ModalAssignUsersProjectsComponent } from '../modal-assign-users-projects/modal-assign-users-projects.component';

@Component({
  selector: 'app-projects-detail',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    BreadcrumbComponent,
    MatButtonModule,
    MatListModule,
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSnackBarModule,
  ],
  templateUrl: './projects-detail.component.html',
  styleUrl: './projects-detail.component.scss',
})
export class ProjectsDetailComponent {
  proyectoId!: string;
  proyecto: any;
  breadcrumbs = [
    {
      title: 'Gestión de proyectos',
      items: ['Listado de proyectos'],
      active: 'Detalle del proyecto',
    },
  ];
  displayedColumns: string[] = ['name', 'email', 'actions'];

  isLoading = true;

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private readonly projectsService: ProjectsService,
    private route: ActivatedRoute,
    private readonly _snackBar: MatSnackBar,
    private readonly dialogModel: MatDialog
  ) {}

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id')!;
    this.getProjectData();
  }

  getProjectData() {
    this.projectsService.getProjectById(this.proyectoId).subscribe({
      next: (data) => {
        this.proyecto = data.project;
        this.dataSource.data = data.project.usuarios;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        console.log(this.proyecto);
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      },
    });
  }

  disassociateUserFromProject(userId: string) {
    this.projectsService.disassociate(userId, this.proyectoId).subscribe({
      next: () => {
        this._snackBar.open('Usuario desasignado correctamente', 'Cerrar', {
          duration: 5000,
        });
        this.getProjectData();
      },
      error: (error) => {
        this._snackBar.open('Error al desasignar usuario', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  openModalAsignarNuevoUsuario(projectId: string): void {
    const dialogRef = this.dialogModel.open(ModalAssignUsersProjectsComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
      data: projectId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjectData();
      }
    });
  }

  dummy(userId: string) {
    console.log('Hola soy dummy' + userId);
  }
}
