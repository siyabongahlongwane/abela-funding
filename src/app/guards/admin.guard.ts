import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  user: any = {};
  constructor(private router: Router, private shared: SharedService) { };
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.user = JSON.parse(localStorage.getItem('user')! || '{}');
    let keys = Object.keys(this.user)
    let isLoggedIn = keys.length > 0 && this.user['role']['id'] == 'Admin' ? true : false;

    if (!isLoggedIn) {
      this.shared.openSnackbar('Only Admins can access this page!');
      this.router.navigate(['/abela/auth/login']);
      return isLoggedIn;
    } else {
      return true;
    }
  }

}
