// Importaciones necesarias para el componente, incluyendo Angular Material y servicios propios
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
  selector: 'app-projects-detail', // Selector del componente
  standalone: true, // Define que es un componente independiente
  imports: [
    // Módulos importados para este componente
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
  templateUrl: './projects-detail.component.html', // Ruta del archivo HTML asociado
  styleUrl: './projects-detail.component.scss', // Ruta del archivo de estilos
})
export class ProjectsDetailComponent {
  proyectoId!: string; // ID del proyecto recibido por parámetro de ruta
  proyecto: any; // Objeto donde se almacena el proyecto recibido
  breadcrumbs = [
    // Arreglo para mostrar ruta de navegación
    {
      title: 'Gestión de proyectos',
      items: ['Listado de proyectos'],
      active: 'Detalle del proyecto',
    },
  ];
  displayedColumns: string[] = ['name', 'email', 'actions']; // Columnas que se mostrarán en la tabla

  isLoading = true; // Bandera para mostrar el spinner de carga

  dataSource = new MatTableDataSource<any>([]); // Fuente de datos de la tabla
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Referencia al paginador

  // Constructor donde se inyectan los servicios necesarios
  constructor(
    private readonly projectsService: ProjectsService, // Servicio para obtener datos del proyecto
    private route: ActivatedRoute, // Servicio para acceder a parámetros de la ruta
    private readonly _snackBar: MatSnackBar, // Servicio para mostrar notificaciones
    private readonly dialogModel: MatDialog // Servicio para abrir modales
  ) {}

  // Hook que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id')!; // Se obtiene el ID del proyecto desde la URL
    this.getProjectData(); // Se llama a la función que obtiene los datos del proyecto
  }

  // Función que obtiene los datos del proyecto desde el servicio
  getProjectData() {
    this.projectsService.getProjectById(this.proyectoId).subscribe({
      next: (data) => {
        this.proyecto = data.project; // Se asignan los datos del proyecto
        this.dataSource.data = data.project.usuarios; // Se llenan los datos de la tabla con los usuarios asignados
        this.dataSource.paginator = this.paginator; // Se asocia el paginador a la tabla
        this.isLoading = false; // Se oculta el spinner de carga
        console.log(this.proyecto); //Debug
      },
      error: (error) => {
        this.isLoading = false; // Se oculta el spinner si ocurre error
        console.error(error); //Se muestra el error en la consola
      },
    });
  }

  // Función para desasociar un usuario del proyecto
  disassociateUserFromProject(userId: string) {
    this.projectsService.disassociate(userId, this.proyectoId).subscribe({
      next: () => {
        this._snackBar.open('Usuario desasignado correctamente', 'Cerrar', {
          duration: 5000, // Se muestra notificación de éxito por 5 segundos
        });
        this.getProjectData(); // Se recargan los datos del proyecto
      },
      error: (error) => {
        this._snackBar.open('Error al desasignar usuario', 'Cerrar', {
          duration: 3000, // Se muestra notificación de error por 3 segundos
        });
      },
    });
  }

  // Función para abrir el modal que asigna nuevos usuarios al proyecto
  openModalAsignarNuevoUsuario(projectId: string): void {
    const dialogRef = this.dialogModel.open(ModalAssignUsersProjectsComponent, {
      minWidth: '300px', // Tamaño mínimo del modal
      maxWidth: '1000px', // Tamaño máximo del modal
      width: '840px', // Ancho preferido
      disableClose: true, // No se permite cerrar el modal haciendo clic afuera
      data: projectId, // Se pasa el ID del proyecto como data
    });

    // Cuando se cierre el modal, si hay un resultado, se recargan los datos del proyecto
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjectData();
      }
    });
  }

  // Función de prueba para debug
  dummy(userId: string) {
    console.log('Hola soy dummy' + userId);
  }
}
