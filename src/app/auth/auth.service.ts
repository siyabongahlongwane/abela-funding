import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl: string = environment.backendUrl;
  constructor(private http: HttpClient, public router: Router) { }

  register(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.post(url, body);
  }

  login(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/abela/auth/login']);
  }
}
