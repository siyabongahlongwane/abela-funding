import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router, private shared: SharedService, private auth: AuthService) { }

  ngOnInit(): void {
  }

  goToPage() {
    this.auth.user$.subscribe(res => {
      console.log(res);
      if (!res) {
        this.router.navigate(['']);
        return;
      }
      if (res?.role.description.includes('Admin')) this.router.navigate(['admin/dashboard']);
      else this.router.navigate(['beneficiary/applications/my-applications']);
    });
  }
}
