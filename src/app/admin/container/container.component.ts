import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  active: boolean = false;
  sideNavItems: any[] = [
    {
      url: 'abela/admin/dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      isActive: false
    },
    {
      url: 'abela/admin/applications/all',
      title: 'Applications',
      icon: 'assignment_add',
      isActive: false
    },
    {
      url: 'beneficiaries',
      title: 'Beneficiaries',
      icon: 'diversity_3',
      isActive: false
    },
    {
      url: 'teammates',
      title: 'Teammates',
      icon: 'groups',
      isActive: false
    },
  ];

  selectedItem: number = 0;

  constructor(private router: Router) {
    this.checkActiveRoute();
  }

  ngOnInit(): void {
  }

  checkActiveRoute() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes('applications')) {
          this.selectedItem = 1;
        }
        else {
          this.selectedItem = this.sideNavItems.findIndex((item: any) => event.url.includes(item.url));
        }
      }
    })
  }

  goTo(url: string, i: number) {
    this.selectedItem = i;
    this.router.navigate([url])
  }
}
