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
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  displayedColumns: string[] = ['dateCreated', 'name', 'surname', 'email', 'phone', 'requestingFor', 'status', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort; 
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
  loading$ = this.loader.loading$;

  selectedRow: any = {};
  counts: number[] = [0, 0, 0, 0, 0];
  selectedButton: number = 0;
  filter: string = '';
  applicationsCount: number = 0;
  tableData: any[] = [];
  constructor(private activatedRoute: ActivatedRoute, private dialog: MatDialog, private sharedService: SharedService, private applicationService: ApplicationsService, private router: Router, public loader: LoadingService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.filter = params['applicationType'];
      this.filterTableData(this.filter);
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
      if (res){
        this.deleteApplication(applicationId);
      };
    });
  }

  deleteApplication(applicationId: string) {
    this.applicationService.deleteApplication(`applications/deleteApplication/${applicationId}`).subscribe((data: any) => {
      this.sharedService.openSnackbar(data.msg);
      this.fetchApplicationsData('');
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Deleting Application, Try Again Later.');
    })
  };


  fetchApplicationsData(filter: any) {
    console.log(filter);
    this.applicationService.genericFetchApplications(`applications/fetchApplications${filter}`).subscribe((data: any) => {
      data.forEach((application: any) => {
        let temp = {};
        temp = {
          _id: application._id,
          date: application.dateCreated,
          name: application.personalDetails.name,
          surname: application.personalDetails.surname,
          email: application.addressDetails.email,
          phone: application.addressDetails.cellOne,
          status: application.status.current,
          requestingFor: application.personalDetails.requestingFor
        };

        this.tableData.push(temp);
      })
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.applicationsCount = data.length;
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(`Filter: ${this.dataSource.filter}`);
  }

  viewApplication(applicationId: string) {
    this.router.navigate([`abela/admin/applications/view/${applicationId}`]);
  }
}
