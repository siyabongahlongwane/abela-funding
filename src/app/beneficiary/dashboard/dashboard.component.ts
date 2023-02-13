import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { SharedService } from 'src/app/services/shared.service';

interface Chart {
  title: string;
  labels: Label[];
  data?: any;
  datasets?: any
  type: ChartType,
  colors: any
}

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
      title: 'Pending',
      count: 100,
      route: '/abela/admin/applications/pending',
      bg: 'orange-bg'
    },
    {
      icon: 'thumb_up',
      title: 'Approved',
      count: 900,
      route: '/abela/admin/applications/approved',
      bg: 'green-bg'
    },
    {
      icon: 'thumb_down',
      title: 'Rejected',
      count: 50,
      route: '/abela/admin/applications/rejected',
      bg: 'red-bg'
    }
  ]

  charts: Chart[] = [
    {
      title: 'Data - Pie Chart',
      labels: ['Pending', 'In Review', 'Approved', 'Rejected'],
      datasets: [
        { data: [100, 150, 900, 50], label: 'Series A', backgroundColor: ['#000'] },
      ],
      type: 'pie',
      colors: [
        {
          backgroundColor: ["#ffa500", "#212158", "#149a00", "#c20000"]
        }]
    },
    {
      title: 'Data - Bar Chart',
      labels: ['Pending', 'In Review', 'Approved', 'Rejected'],
      datasets: [
        { data: [100, 150, 900, 50], label: '' },
      ],
      type: 'bar',
      colors: [
        {
          backgroundColor: ["#ffa500", "#212158", "#149a00", "#c20000"]
        }]
    }
  ]

  admin: any = {};

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  getUser() {
    this.admin = this.sharedService.get('user');
  }


}