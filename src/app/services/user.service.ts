import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    backendUrl: string = environment.backendUrl;
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
