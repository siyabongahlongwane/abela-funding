import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private activatedRoute: ActivatedRoute, private dialog: MatDialog, private sharedService: SharedService, private applicationService: ApplicationsService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let filterParam = params['applicationType'];
      this.filterTableData(filterParam);
      this.fetchApplicationsCount('?type=dashboard');
    });
  }

  filterTableData(filter: string) {
    let selectedBtn = filter;
    filter == 'All' ? filter = '' : filter = `?status.current=${filter}`;
    this.filterButtons.forEach((button, i) => {
      this.filterButtons[i]['selected'] = button.filter == selectedBtn ? true : false;
    })
    this.fetchApplicationsData(filter);
  }

  openConfirmDialog(application: any) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      disableClose: true,
      hasBackdrop: true,
      data: {
        heading: 'Confirmation',
        text: 'Delete this application?',
      }
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) this.deleteApplication(res);
    });
  }

  deleteApplication(applicationId: string) {
    console.log(`Application with ID: ${applicationId} has been Deleted`);
  };

  fetchApplicationsCount(filter: any) {
    this.applicationService.genericFetchApplications(`applications/fetchApplications${filter}`).subscribe((data: number[]) => {
      this.counts = data;
    }, err => {
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application Counts, Try Again Later.');
    })
  }

  fetchApplicationsData(filter: any) {
    this.applicationService.genericFetchApplications(`applications/fetchApplications${filter}`).subscribe((data: any) => {
      this.dataSource = data;
    }, err => {
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
    })
  }
}
