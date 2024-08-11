import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { ApplicationsService } from 'src/app/services/applications.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-referral-dialog',
  templateUrl: './referral-dialog.component.html',
  styleUrls: ['./referral-dialog.component.scss']
})
export class ReferralDialogComponent implements OnInit {
  referralForm!: FormGroup;
  personalDetails!: FormGroup;
  contactDetails!: FormGroup;
  loading$ = this.loader.loading$;
  tempUser: any;
  constructor(private fb: FormBuilder, private sharedService: SharedService, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, @Optional() public dialogRef: MatDialogRef<ReferralDialogComponent>, private userService: UserService, public loader: LoadingService, private applicationService: ApplicationsService) {
    this.referralForm = this.fb.group({
      personalDetails: this.personalDetailsForm(),
      contactDetails: this.contactDetailsForm(),
      refId: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.tempUser = this.sharedService.get('tempUser');
  }

  personalDetailsForm(): FormGroup {
    this.personalDetails = new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
    });
    return this.personalDetails;
  }

  contactDetailsForm(): FormGroup {
    this.contactDetails = new FormGroup({
      cellOne: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]),
    });
    return this.contactDetails;
  }

  register(form: FormGroup) {
    this.createRefId();
    if (form.invalid) {
      return this.sharedService.openSnackbar('Please enter all required fields correctly!');
    } else {
      this.saveReferralDetails();
    }
  }

  createRefId() {
    let refId = this.referralForm.value.personalDetails.name + '-' + (Math.random() + 1).toString(36).substring(2);
    this.referralForm.patchValue({ refId });
  }

  close(data?: any) {
    this.dialogRef.close();
  }

  saveReferralDetails() {
    const formValue = this.referralForm.value;
    this.applicationService.addReferrer({ ...formValue }).subscribe(resp => {
      if (resp.msg) {
        this.sharedService.set('tempUser', { ...formValue });
        this.tempUser = { ...formValue };
        this.sharedService.openSnackbar(resp.msg);
      }
    }, err => {
      console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
    })
  }
}