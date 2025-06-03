import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '@core/models/config';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  urlBaseService: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) {}

  getAllProjects(filters?: any) {
    const endpoint = `${this.urlBaseService}/api/v1/projects`;
    return this.http.get<any>(endpoint, { params: filters });
  }

  getProjectById(projectId: string) {
    const endpoint = `${this.urlBaseService}/api/v1/projects/${projectId}`;
    return this.http.get<any>(endpoint);
  }

  associateUserToProject(userId: number, projectId: number) {
    const endpoint = `${this.urlBaseService}/api/v1/projects/associate`;
    return this.http.post<any>(endpoint, {
      usuario_id: userId,
      proyecto_id: projectId,
    });
  }

  disassociate(userId: string, projectId: string) {
    const endpoint = `${this.urlBaseService}/api/v1/projects/disassociate`;
    return this.http.delete<any>(endpoint, {
      body: {
        usuario_id: userId,
        proyecto_id: projectId,
      },
    });
  }
}
