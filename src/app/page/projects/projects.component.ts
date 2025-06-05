// Importaciones de módulos y dependencias necesarias para el componente
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

// Decorador que define el componente Angular
@Component({
  selector: 'app-projects', // Nombre del selector que se usará en el HTML
  standalone: true, // Indica que este componente se puede usar sin formar parte de un módulo
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
  templateUrl: './projects.component.html', // Archivo HTML del componente
  styleUrl: './projects.component.scss', // Archivo SCSS del componente
})
export class ProjectsComponent {
  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = [
    'name',
    'description',
    'date',
    'total-users',
    'administrator',
    'actions',
  ];

  // Estructura para las migas de pan (navegación superior)
  breadcrumbs = [
    {
      title: 'Gestión de proyectos',
      items: [],
      active: 'Listado de proyectos',
    },
  ];

  // Fuente de datos para la tabla de proyectos
  dataSource = new MatTableDataSource<any>([]);
  // Referencia al paginador de Angular Material
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // Formulario reactivo para la búsqueda de proyectos
  projectFormSearchFilter!: FormGroup;

  // Lista de proyectos obtenidos del backend
  projectsList: any[] = [];

  // Bandera que indica si se están cargando los datos
  isLoading = false;

  // Filtros por defecto para búsqueda de proyectos
  projectDefaultFilterSearch: any = {
    name: undefined,
  };

  // Constructor donde se inyectan servicios necesarios
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly projectsService: ProjectsService,
    private readonly dialogModel: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.createFormSearchFilter(); // Crea el formulario de búsqueda
    this.getAllProjectsByUser(); // Carga los proyectos al iniciar
    this.handleProjectFilterChange('name', 'name'); // Escucha cambios en el filtro por nombre
  }

  // Método para inicializar el formulario de búsqueda
  createFormSearchFilter() {
    this.projectFormSearchFilter = this._formBuilder.group({
      name: [''], // Campo de búsqueda por nombre
    });
  }

  // Escucha los cambios en el formulario y aplica el filtro con un retraso
  handleProjectFilterChange(controlName: string, filterField: string): void {
    this.projectFormSearchFilter
      .get(controlName)
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged()) // Espera 300ms y evita valores repetidos
      .subscribe((value) => {
        this.projectDefaultFilterSearch[filterField] = value; // Actualiza el filtro
        this.getAllProjectsByUser({ ...this.projectDefaultFilterSearch }); //Obtiene proyectos filtrados
      });
  }

  // Llama al servicio para obtener los proyectos del usuario, con o sin filtros
  getAllProjectsByUser(filter?: any) {
    this.isLoading = true; // Activa el indicador de carga
    this.projectsService.getAllProjects(filter).subscribe({
      next: (response) => {
        this.projectsList = response.projects; // Almacena los proyectos
        this.dataSource.data = response.projects; // Asigna los datos a la tabla
        this.dataSource.paginator = this.paginator; // Conecta el paginador
        this.isLoading = false; // Finaliza la carga
      },
      error: () => {
        this.isLoading = false; // Finaliza la carga en caso de error
      },
    });
  }

  // Método para eliminar un proyecto
  deleteProject(projectId: string) {
    this.projectsService.deleteProject(projectId).subscribe({
      next: (response) => {
        // Muestra notificación de exito
        this._snackBar.open('Proyecto eliminado correctamente', 'Cerrar', {
          duration: 5000,
        });
        this.getAllProjectsByUser(); // Recarga los proyectos
      },
      error: () => {
        // Muestra notificación de error
        this._snackBar.open('Error al eliminar el proyecto', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  // Abre el modal para crear un nuevo proyecto
  openModalCreateProject() {
    const dialogRef = this.dialogModel.open(ModalCreateProjectComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true, // No se puede cerrar haciendo clic fuera del modal
    });

    // Si se crea un proyecto, recarga la lista
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllProjectsByUser();
      }
    });
  }

  // Abre el modal para editar un proyecto existente
  openModalUpdateProject(projectInformation: any) {
    const dialogRef = this.dialogModel.open(ModalEditProjectComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
      data: projectInformation, // Pasa los datos del proyecto al modal
    });

    // Si se actualiza el proyecto, recarga la lista
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllProjectsByUser();
      }
    });
  }

  // Navega a la vista de detalle de un proyecto
  verDetalle(projectId: string) {
    this.router.navigate(['page/projects/', projectId]); // Redirige con el ID del proyecto
  }
}
