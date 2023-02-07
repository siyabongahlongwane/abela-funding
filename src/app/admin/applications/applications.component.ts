import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmPopupComponent } from 'src/app/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  tableData: any[] = [
    { ref: 1, name: 'Siyabonga', surname: "Testing", id: '1234567', status: 'Pending', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 2, name: 'Sne', surname: "Testing", id: '1234567', status: 'Pending', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 3, name: 'Nonhlanhla', surname: "Testing", id: '1234567', status: 'Approved', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 4, name: 'Samke', surname: "Testing", id: '1234567', status: 'Rejected', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 5, name: 'Gordon', surname: "Testing", id: '1234567', status: 'In Review', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 6, name: 'Brian', surname: "Testing", id: '1234567', status: 'Approved', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 7, name: 'Steve', surname: "Testing", id: '1234567', status: 'In Review', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 8, name: 'Beauty', surname: "Testing", id: '1234567', status: 'Approved', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 9, name: 'Florence', surname: "Testing", id: '1234567', status: 'Pending', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 10, name: 'Sphe', surname: "Testing", id: '1234567', status: 'Rejected', email: 'test@gmail.com', phone: '0670146942' },
  ];

  displayedColumns: string[] = ['ref', 'name', 'surname', 'id', 'email', 'phone', 'status', 'action'];
  dataSource: any[] = this.tableData;

  filterButtons: any[] = [
    {
      text: 'All',
      filter: 'all'
    },
    {
      text: 'Pending',
      filter: 'pending'
    },
    {
      text: 'In Review',
      filter: 'in review'
    },
    {
      text: 'Approved',
      filter: 'approved'
    },
    {
      text: 'Rejected',
      filter: 'rejected'
    }
  ]

  selectedFilter: string = '';
  selectedRow: any = {};
  constructor(private activatedRoute: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.filterTableData(params['applicationType']);
    });
  }

  filterTableData(filter: string) {
    this.selectedFilter = filter;
    this.dataSource = this.tableData;
    if (filter !== 'all') {
      this.dataSource = this.tableData.filter(application => {
        return application.status.toLowerCase() == filter;
      });
    }
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
}
