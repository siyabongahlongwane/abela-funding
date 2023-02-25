import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  backendUrl: string = 'http://localhost:5000/api'
  constructor(private http: HttpClient) { }

  update(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.put(url, body);
  }
}
