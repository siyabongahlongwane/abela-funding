import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cards: any = [
    {
      icon: 'event_note',
      title: 'All Applications',
      count: 1200,
      route: '/abela/admin/applications/all',
      bg: 'primary-bg'
    },
    {
      icon: 'hourglass_bottom',
      title: 'Pending Applications',
      count: 100,
      route: '/abela/admin/applications/pending',
      bg: 'orange-bg'
    },
    {
      icon: 'thumb_up',
      title: 'Approved Applications',
      count: 900,
      route: '/abela/admin/applications/approved',
      bg: 'green-bg'
    },
    {
      icon: 'thumb_down',
      title: 'Rejected Applications',
      count: 290,
      route: '/abela/admin/applications/rejected',
      bg: 'red-bg'
    }
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
