import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    // backendUrl: string = 'http://localhost:5000/api';
    backendUrl: string = 'https://abela-trust.onrender.com';
  constructor(private http: HttpClient) { }

  update(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.put(url, body);
  }

  fetchReferrer(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }


  fetchAllReferrals(endpoint: string) {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }
}
