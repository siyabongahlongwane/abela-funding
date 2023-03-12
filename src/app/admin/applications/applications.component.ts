import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/components/confirm-popup/confirm-popup.component';
import { ApplicationsService } from 'src/app/services/applications.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  displayedColumns: string[] = ['dateCreated', 'name', 'surname', 'email', 'phone', 'requestingFor', 'status', 'action'];
  dataSource: any[] = []

  filterButtons: any[] = [
    {
      text: 'All',
      filter: 'All',
      slelected: false
    },
    {
      text: 'Pending',
      filter: 'Pending',
      slelected: false
    },
    {
      text: 'In Review',
      filter: 'In Review',
      slelected: false
    },
    {
      text: 'Approved',
      filter: 'Approved',
      slelected: false
    },
    {
      text: 'Rejected',
      filter: 'Rejected',
      slelected: false
    }
  ]

  selectedRow: any = {};
  counts: number[] = [0, 0, 0, 0, 0];
  selectedButton: number = 0;
  filter: string = '';
  constructor(private activatedRoute: ActivatedRoute, private dialog: MatDialog, private sharedService: SharedService, private applicationService: ApplicationsService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.filter = params['applicationType'];
      this.filterTableData(this.filter);
      this.fetchApplicationsCount('?type=dashboard');
    });
  }

  filterTableData(filter: string) {
    this.filter = filter;
    let selectedBtn = filter;
    this.filter == 'All' ? this.filter = '' : this.filter = `?status.current=${this.filter}`;
    this.filterButtons.forEach((button, i) => {
      this.filterButtons[i]['selected'] = button.filter == selectedBtn ? true : false;
    })
    this.fetchApplicationsData(this.filter);
  }

  openConfirmDialog(applicationId: string) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
        heading: 'Confirmation',
        text: 'Delete this application?',
      }
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) this.deleteApplication(applicationId);
    });
  }

  deleteApplication(applicationId: string) {
    this.applicationService.deleteApplication(`applications/deleteApplication/${applicationId}`).subscribe((data: any) => {
      this.sharedService.openSnackbar(data.msg);
      this.fetchApplicationsData(this.filter);
      this.fetchApplicationsCount('?type=dashboard');
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Deleting Application, Try Again Later.');
    })
  };

  fetchApplicationsCount(filter: any) {
    this.applicationService.genericFetchApplications(`applications/fetchApplications${filter}`).subscribe((data: number[]) => {
      this.counts = data;
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application Counts, Try Again Later.');
    })
  }

  fetchApplicationsData(filter: any) {
    this.applicationService.genericFetchApplications(`applications/fetchApplications${filter}`).subscribe((data: any) => {
      this.dataSource = data;
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
    })
  }

  viewApplication(applicationId: string) {
    this.router.navigate([`abela/admin/applications/view/${applicationId}`]);
  }
}
