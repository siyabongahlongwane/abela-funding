import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { ApplicationsService } from 'src/app/services/applications.service';
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
  counts: number[] = [0, 0, 0, 0];
  cards: any = [
    {
      icon: 'event_note',
      title: 'All Applications',
      count: 0,
      route: '/abela/admin/applications/all',
      bg: 'primary-bg'
    },
    {
      icon: 'hourglass_bottom',
      title: 'Pending',
      count: 0,
      route: '/abela/admin/applications/pending',
      bg: 'orange-bg'
    },
    {
      icon: 'thumb_up',
      title: 'Approved',
      count: 0,
      route: '/abela/admin/applications/approved',
      bg: 'green-bg'
    },
    {
      icon: 'thumb_down',
      title: 'Rejected',
      count: 0,
      route: '/abela/admin/applications/rejected',
      bg: 'red-bg'
    }
  ]

  charts: Chart[] = []

  admin: any = {};

  constructor(private sharedService: SharedService, private applicationService: ApplicationsService) { }

  ngOnInit(): void {
    this.fetchApplications();
  }

  getUser() {
    this.admin = this.sharedService.get('user');
  }

  createCharts(counts: any) {
    counts = counts.slice(1);
    this.charts = [
      {
        title: 'Data - Pie Chart',
        labels: ['Pending', 'In Review', 'Approved', 'Rejected'],
        datasets: [
          { data: counts, label: 'Series A', backgroundColor: ['#000'] },
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
          { data: counts, label: '' },
        ],
        type: 'bar',
        colors: [
          {
            backgroundColor: ["#ffa500", "#212158", "#149a00", "#c20000"]
          }]
      }
    ]
  }

  fetchApplications() {
    this.applicationService.genericFetchApplications(`applications/fetchApplications?type=dashboard`).subscribe(counts => {
      console.log(counts);
      this.counts = counts;
      if (counts) {
        counts.forEach((count: number, i: number) => {
          this.cards[i]['count'] = count;
        });
        this.createCharts(this.counts);
      }
    }, err => {
      this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
    })
  }
}
