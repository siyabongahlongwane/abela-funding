import { HostListener, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private snackbar: MatSnackBar) {
    this.detectScreenSize();
  }

  // ========================================================
  // Detect Screen Size Start
  // ========================================================
  @HostListener("window:resize", [])
  public onResize() {
    this.detectScreenSize();
  }


  detectScreenSize() {
    return window.innerWidth;
  }
  // ========================================================
  // End
  // ========================================================

  get(key: string): any {
    const data = localStorage.getItem(key);
    return JSON.parse(data!);
  }

  set(key: string, body: any): any {
    localStorage.setItem(key, JSON.stringify(body));
  }

  openSnackbar(message: string, theme?: string) {
    this.snackbar.open(message, 'OK', { duration: 3000 });
  }
}
