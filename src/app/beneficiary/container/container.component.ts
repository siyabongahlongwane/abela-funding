import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  active: boolean = false;
  width: number = 0;
  sideNavItems: any[] = [
    {
      url: 'beneficiary/applications/my-applications',
      title: 'Applications',
      icon: 'assignment_add',
      isActive: false
    },
    {
      url: 'beneficiary/profile',
      title: 'My Profile',
      icon: 'account_circle',
      isActive: false
    }
  ];

  selectedItem: number = 0;
  user$!: Observable<any>;
  currentPage: string = '';
  constructor(private router: Router, private sharedService: SharedService, private auth: AuthService) {
    this.checkActiveRoute();
    this.width = this.sharedService.detectScreenSize();
  }

  ngOnInit(): void {
    this.auth.userSub.next(this.sharedService.get('user'));
    this.user$ = this.auth.user$;
  }

  checkActiveRoute() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.router.url.includes('applications')) {
          this.selectedItem = 0;
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

  setPageName(urlFragments: string[]) {
    this.currentPage = urlFragments[2][0].toUpperCase() + urlFragments[2].slice(1);
    // if (urlFragments[4]) this.currentPage += ` - ${urlFragments[4]}`
  }
}
