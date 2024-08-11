import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl: string = environment.backendUrl;
  userSub = new BehaviorSubject<any>(null);
  user$ = this.userSub.asObservable();

  constructor(private http: HttpClient, public router: Router) { }

  register(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.post(url, body);
  }

  login(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  forgotPassword(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.post(url, body);
  }

  resetPassword(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.post(url, body);
  }

  logout() {
    localStorage.removeItem('user');
    this.userSub.next(null);
    this.router.navigate(['']);
  }
}
