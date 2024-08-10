import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReferralDialogComponent } from '../referral-dialog/referral-dialog.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  cards: Array<{ label: string, txt: string, icon: string, route: string }> = [
    {
      label: 'Refer someone',
      txt: 'Share this opportunity with someone you know who might need it and you could win yourself a mini tablet or smartphone!',
      icon: 'account_circle',
      route: ''
    },
    {
      label: 'Register',
      txt: 'Create an account and apply for funding by following the steps provided in the process and uploading the required documents.',
      icon: 'account_circle',
      route: 'auth/register'
    },
    {
      label: 'Login',
      txt: 'Log in to your account and manage your profile and applications, view statuses of your applications and get updates.',
      icon: 'account_circle',
      route: 'auth/login'
    },
  ];
  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.goTo('');
  }

  goTo(route: string) {
    if(!route) this.dialog.open(ReferralDialogComponent, {
      disableClose: true,

    }).afterClosed().subscribe((x) => {
      console.log(x);
    })
    else this.router.navigate([route]);
  }

}
