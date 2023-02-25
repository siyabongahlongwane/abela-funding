import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  constructor(private sharedService: SharedService, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = this.sharedService.get('user');
  }

  openRegisterDialog() {
    let dialog = this.dialog.open(RegisterComponent, {
      data: this.user,
      disableClose: true,
      hasBackdrop: true
    });

    dialog.afterClosed().subscribe(data => data && this.updateDetails(data));
  }

  updateDetails(data: any) {
    this.userService.update(`users/updateProfile/${this.user['_id']}`, data).subscribe(resp => {
      if (resp.msg) {
        this.sharedService.openSnackbar(resp.msg);
        this.sharedService.set('user', resp.updatedProfile);
        window.location.reload();
      }
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error updating profile');
    })
  }
}
