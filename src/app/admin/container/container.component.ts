import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  active: boolean = false;
  sideNavItems: any[] = [
    {
      url: 'admin/dashboard',
      title: 'Dashboard',
      icon: 'dashboard',
      isActive: false
    },
    {
      url: 'admin/applications/All',
      title: 'Applications',
      icon: 'assignment_add',
      isActive: false
    },
    {
      url: 'admin/referrals',
      title: 'Referrals',
      icon: 'groups',
      isActive: false
    }
    // {
    //   url: 'beneficiaries',
    //   title: 'Beneficiaries',
    //   icon: 'diversity_3',
    //   isActive: false
    // },
    // {
    //   url: 'teammates',
    //   title: 'Teammates',
    //   icon: 'groups',
    //   isActive: false
    // },
  ];

  selectedItem: number = 0;
  user: any = {};
  currentPage: string = '';
  constructor(private router: Router, private sharedService: SharedService) {
    this.checkActiveRoute();
  }

  ngOnInit(): void {
    this.getUser();
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
      let urlFragments = this.router.url.split('/');
      if(urlFragments.some(str => str)) this.setPageName(urlFragments);
      
    })
  }

  goTo(url: string, i: number) {
    this.selectedItem = i;
    this.router.navigate([url])
  }

  getUser() {
    this.user = this.sharedService.get('user');
  }

  setPageName(urlFragments: string[]) {
    this.currentPage = urlFragments[2][0].toUpperCase() + urlFragments[2].slice(1);
    if (urlFragments[3]) this.currentPage;
  }
}
