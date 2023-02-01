import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  get(key: string): any {
    const data = localStorage.getItem(key);
    return data && JSON.parse(data);
  }

  set(key: string, body: any): any {
    localStorage.setItem(key, JSON.stringify(body));
  }
}
