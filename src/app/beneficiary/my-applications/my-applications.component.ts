import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/components/confirm-popup/confirm-popup.component';
import { ApplicationsService } from 'src/app/services/applications.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  displayedColumns: string[] = ['dateCreated', 'name', 'email', 'requestingFor', 'status', 'action'];
  dataSource: any;
  counts: number[] = [0, 0, 0, 0, 0];
  filter: string = '';
  user: any = {};
  applicationsCount: number = 0;
  tableData: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  loading$ = this.loader.loading$;
  constructor(private dialog: MatDialog, private sharedService: SharedService, private applicationService: ApplicationsService, private router: Router, public loader: LoadingService) { }

  ngOnInit(): void {
    this.user = this.sharedService.get('user');
    this.fetchApplicationsData(`?addressDetails.email=${this.user?.contactDetails?.email}`);
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
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Deleting Application, Try Again Later.');
    })
  };

  fetchApplicationsData(filter: any) {
    this.applicationService.genericFetchApplications(`applications/fetchApplications${filter}`).subscribe((data: any) => {
      data.forEach((application: any) => {
        let temp = {}
        temp = Object.assign(temp, {
          _id: application._id,
          date: application.dateCreated,
          name: application.personalDetails.name,
          surname: application.personalDetails.surname,
          email: application.addressDetails.email,
          status: application.status.current,
          requestingFor: application.personalDetails.requestingFor,
        });

        this.tableData.push(temp);
      });

      this.dataSource = new MatTableDataSource(this.tableData);
      this.applicationsCount = data.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
    });
  }

  goTo(applicationId: string, route: string) {
    this.router.navigate([`abela/beneficiary/applications/${route}/${applicationId}`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
