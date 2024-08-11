import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { ForgotPasswordComponent } from 'src/app/shared/forgot-password/forgot-password.component';
import { setUpKeyValueList } from 'src/app/utils/KeyToHumanValue';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  message: string = '';
  loading$ = this.loader.loading$;
  url: string = 'https://apply.theabelatrust.co.za/auth/register';
  userDetailsList: any;
  constructor(private sharedService: SharedService, private userService: UserService, private dialog: MatDialog, public loader: LoadingService, private auth: AuthService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = this.sharedService.get('user');
    this.auth.userSub.next(this.user);
    const userDetailsKeyList = ['cellOne', 'cellTwo', 'email', 'town', 'city', 'province'];
    this.userDetailsList = setUpKeyValueList({ ...this.user.contactDetails, ...this.user.addressDetails }, userDetailsKeyList);
  }

  openRegisterDialog() {
    let dialog = this.dialog.open(RegisterComponent, {
      data: this.user,
      disableClose: true,
      hasBackdrop: true,
      maxWidth: 320,
      maxHeight: '80vh'
    });

    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.updateDetails(data);
      }
    });
  }

  openPasswordDialog() {
    this.dialog.open(ForgotPasswordComponent, {
      data: { email: this.user?.contactDetails?.email, header: 'Reset Password', action: 'reset' },
      disableClose: true,
    });
  }

  updateDetails(data: any) {
    this.userService.update(`users/updateProfile/${this.user['_id']}`, data).subscribe(resp => {
      if (resp.msg) {
        this.sharedService.openSnackbar(resp.msg);
        this.sharedService.set('user', resp.updatedProfile);
        this.getUser();
      }
    }, err => {
      console.log(err);
      this.sharedService.openSnackbar(err.error.msg || 'Error updating profile');
    })
  }

  copyRefId() {
    // Copy text to clipboard
    navigator.clipboard.writeText(`Click on this link to join: http://localhost:4000/auth/register?refId=${this.user.refId}`);
    this.sharedService.openSnackbar('Text Copied');
  }

  shareLink() {
    const message = `Click on this link to join: ${this.url}?refId=${this.user.refId}`
  }
}