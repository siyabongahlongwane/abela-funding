import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() drawer: any;
  @Input() user: any;
  @Input() currentPage: any;
  sideNavItems: any[] = [
    {
      url: '/abela/beneficiary/applications/my-applications',
      title: 'Applications',
      icon: 'assignment_add',
      isActive: false
    },
    {
      url: '/abela/beneficiary/profile',
      title: 'My Profile',
      icon: 'account_circle',
      isActive: false
    }
  ];
  constructor(public authService: AuthService, public location: Location) { }

  ngOnInit(): void {
  }

}
