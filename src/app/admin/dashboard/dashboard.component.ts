import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label, MultiDataSet } from 'ng2-charts';
import { ApplicationsService } from 'src/app/services/applications.service';
import { LoadingService } from 'src/app/services/loading.service';
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
      route: '/admin/applications/All',
      bg: 'primary-bg'
    },
    {
      icon: 'hourglass_bottom',
      title: 'Pending',
      count: 0,
      route: '/admin/applications/Pending',
      bg: 'orange-bg'
    },
    {
      icon: 'thumb_up',
      title: 'Approved',
      count: 0,
      route: '/admin/applications/Approved',
      bg: 'green-bg'
    },
    {
      icon: 'thumb_down',
      title: 'Rejected',
      count: 0,
      route: '/admin/applications/Rejected',
      bg: 'red-bg'
    }
  ]

  charts: Chart[] = []
  chartsOptions = {
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
          // OR //
          beginAtZero: true   // minimum value will be 0.
        }
      }]
    }
  };
  admin: any = {};
  loading$ = this.loader.loading$;

  constructor(private sharedService: SharedService, private applicationService: ApplicationsService, public loader: LoadingService) { }

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
      let chartCount = counts.map((count: number) => count)
      this.createCharts(chartCount);
      this.counts = counts.splice(2, 1);;
      if (counts) {
        counts.forEach((count: number, i: number) => {
          this.cards[i]['count'] = count;
        });
      }
    }, err => {
console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
    })
  }
}
