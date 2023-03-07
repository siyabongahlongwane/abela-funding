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
  message: string = '';
  constructor(private sharedService: SharedService, private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.user = this.sharedService.get('user');
    this.message = `Click on this link to join: http://localhost:4000/abela/auth/register?refId=${this.user.refId}`
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

  copyRefId() {
    // Copy text to clipboard
    navigator.clipboard.writeText(`Click on this link to join: http://localhost:4000/abela/auth/register?refId=${this.user.refId}`);
    this.sharedService.openSnackbar('Text Copied');
  }

  shareLink() {
    const message = `Click on this link to join: http://localhost:4000/abela/auth/register?refId=${this.user.refId}`

  }

  facebook() {
    const facebookApi = `https://www.facebook.com/sharer/sharer.php?u=http://localhost:4000/abela/auth/register?refId=${this.user.refId}`;
    window.open(facebookApi, '_blank')
  }
  twitter() {
    const twitterApi = `https://twitter.com/intent/tweet?text=${this.message}`;
    window.open(twitterApi, '_blank')
  }
  instagram() {

  }

  whatsapp() {
    window.open(`https://wa.me/?text=${this.message}`, '_blank')

  }
}