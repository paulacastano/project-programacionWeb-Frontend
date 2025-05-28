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
}
