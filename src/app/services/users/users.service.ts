import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '@core/models/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  urlBaseService: string = URL_SERVICIOS;

  constructor(private readonly http: HttpClient) {}

  createUser(user: any): Observable<any> {
    const endpoint = `${this.urlBaseService}/api/v1/users/create`;
    return this.http.post<any>(endpoint, user);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    const endpoint = `${this.urlBaseService}/api/v1/users/update/${userId}`;
    return this.http.put<any>(endpoint, userData);
  }

  deleteUser(userId: number): Observable<any> {
    const endpoint = `${this.urlBaseService}/api/v1/users/delete/${userId}`;
    return this.http.delete<any>(endpoint);
  }

  getAllUsersByAdministrator(filters?: any): Observable<any> {
    const endpoint = `${this.urlBaseService}/api/v1/users/getAllByAdministrator`;
    const params = new HttpParams({
      fromObject: {
        nombre: filters?.nombre || '',
        email: filters?.email || '',
      },
    });
    return this.http.get<any>(endpoint, { params });
  }

  getAllAdministrator(): Observable<any> {
    const endpoint = `${this.urlBaseService}/api/v1/users/getAllAdministrator/1`;
    return this.http.get<any>(endpoint);
  }

  getAllUsers(): Observable<any> {
    const endpoint = `${this.urlBaseService}/api/v1/users/getAll/2`;
    return this.http.get<any>(endpoint);
  }
}
