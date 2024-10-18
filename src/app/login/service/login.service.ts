import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginCredentials } from '../dto/login-credentials';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(loginCredentials: LoginCredentials): Observable<any> {
    return this.httpClient.post<any>(`${environment.apiEndpoint}/users/login`, loginCredentials);
  }
}
