import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
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
  url: string = 'https://apply.theabelatrust.co.za/abela/auth/register';
  userDetailsList: any;
  constructor(private sharedService: SharedService, private userService: UserService, private dialog: MatDialog, public loader: LoadingService, private auth: AuthService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = this.sharedService.get('user');
    this.auth.userSub.next(this.user);
    const userDetailsKeyList = ['cellOne', 'cellTwo', 'email', 'town', 'city', 'province'];
    this.userDetailsList = setUpKeyValueList({...this.user.contactDetails, ...this.user.addressDetails}, userDetailsKeyList);

    this.message = `Looking for educational Support? Need a Bursary? Need Books?
    Is Registration fee a problem....?
    Abela Trust is a registered entity focusing on the upliftment of education in South Africa and aiming to assist as many learners as possible to reach their educational goals.
    To Apply, click on the link: ${this.url}?refId=${this.user.refId}
    Please share this opportunity with someone you know who might need it and you could win yourself a mini tablet or smartphone!`;
  }

  openRegisterDialog() {
    let dialog = this.dialog.open(RegisterComponent, {
      data: this.user,
      disableClose: true,
      hasBackdrop: true,
      maxHeight: '80vh'
    });

    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.updateDetails(data);
      }
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
    navigator.clipboard.writeText(`Click on this link to join: http://localhost:4000/abela/auth/register?refId=${this.user.refId}`);
    this.sharedService.openSnackbar('Text Copied');
  }

  shareLink() {
    const message = `Click on this link to join: ${this.url}?refId=${this.user.refId}`

  }

  facebook() {
    const facebookApi = `https://www.facebook.com/sharer/sharer.php?u=${this.url}?refId=${this.user.refId}`;
    window.open(facebookApi, '_blank')
  }
  tiktok() {
    const twitterApi = `https://twitter.com/intent/tweet?text=${this.message}`;
    window.open(twitterApi, '_blank')
  }
  whatsapp() {
    window.open(`https://wa.me/?text=${this.message}`, '_blank')

  }
}