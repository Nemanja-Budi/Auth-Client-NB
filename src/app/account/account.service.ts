import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Register } from '../shared/models/register.model';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Login } from '../shared/models/login.model';
import { User } from '../shared/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  router: Router = inject(Router);

  constructor(private httpClient: HttpClient) { }

  refreshUser(jwt: string | null) {
    if(jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.httpClient.get<User>(`${environment.appUrl}/api/account/refresh-user-token`, {headers}).pipe(
      map((user: User) => {
        if(user) {
          this.setUser(user);
        }
      })
    );
  }

  register(registerModel: Register): Observable<Register> {
    return this.httpClient.post<Register>(`${environment.appUrl}/api/account/register`, registerModel);
  }

  login(loginModel: Login) {
    return this.httpClient.post<User>(`${environment.appUrl}/api/account/login`, loginModel).pipe(
      map((user: User) => {
        if(user) {
          this.setUser(user)
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
  }

  getJWT(): string | null {
    const key = localStorage.getItem(environment.userKey);
    if(key) {
      const user: User = JSON.parse(key);
      return user.jwt
    }
    else {
      return null;
    }
  }

  private setUser(user: User): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);
  }

}
