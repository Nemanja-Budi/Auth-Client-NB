import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../shared/models/register.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Login } from '../shared/models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) { }

  register(registerModel: Register): Observable<Register> {
    return this.httpClient.post<Register>(`${environment.appUrl}/api/account/register`, registerModel);
  }

  login(loginModel: Login): Observable<Login> {
    return this.httpClient.post<Login>(`${environment.appUrl}/api/account/login`, loginModel);
  }
}
