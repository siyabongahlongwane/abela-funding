import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.scss']
})
export class ReferralsComponent implements OnInit {
  displayedColumns: string[] = ['referralDate', 'referredPerson', 'referredBy', 'email', 'phone'];
  dataSource: any;
  tableData: any[] = [];
  referralsCount: number = 0;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loading$ = this.loader.loading$;

  constructor(private sharedService: SharedService, private router: Router, private userService: UserService, public loader: LoadingService) { }

  ngOnInit(): void {
    this.fetchReferrals();
  }

  fetchReferrals() {
    this.userService.fetchAllReferrals(`users/fetchReferrals`).subscribe((data: any) => {
    this.tableData = [];
    this.referralsCount = data.length;
      data.forEach((obj: any) => {
        let temp = {}
        temp = Object.assign(temp, {
          referralDate: obj.referralDate,
          referredPerson: `${obj.personalDetails.name} ${obj.personalDetails.surname}`,
          referredBy: `${obj.referrer.personalDetails.name} ${obj.referrer.personalDetails.surname}`,
          referrerEmail: `${obj.referrer.contactDetails.email}`,
          referrerPhone: `${obj.referrer.contactDetails.cellOne}`
        });

        this.tableData.push(temp);
      });

      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
    })
  }

  viewApplication(applicationId: string) {
    this.router.navigate([`admin/applications/view/${applicationId}`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
