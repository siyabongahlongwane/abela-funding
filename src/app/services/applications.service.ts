import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  backendUrl: string = 'http://localhost:5000/api'
  constructor(private http: HttpClient, public router: Router) { }

  apply(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.post(url, body);
  }

  login(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  genericFetchApplications(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  fetchMarks(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  deleteApplication(endpoint: string) {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.delete(url);
  }

  updateApplication(endpoint: string, body: any) {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.put(url, body);
  }
}
