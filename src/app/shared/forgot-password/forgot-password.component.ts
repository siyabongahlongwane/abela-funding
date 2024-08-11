import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  emailForm!: FormGroup;
  showPass: boolean = false;
  showCurrentPass: boolean = false;
  width: any = 0;
  loading$ = this.loader.loading$;
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private router: Router, private authService: AuthService, public loader: LoadingService, @Inject(MAT_DIALOG_DATA) public data: { action: string, header: string, email?: string }, public dialogRef: MatDialogRef<ForgotPasswordComponent>) {
    this.emailForm = this.fb.group({
      email: [data?.email, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      currentPassword: [null, data.action == 'reset' ? [Validators.required] : []],
      password: [null, data.action == 'reset' ? [Validators.required] : []]
    })
  }

  ngOnInit(): void {
    this.width = '';
  }

  submitForm(form: FormGroup) {
    if (form.invalid) {
      this.snackbar.open('Please enter a valid email!', 'Close', {
        duration: 5000
      });
      return;
    } else {
      // Process the form
      this.authService.forgotPassword(`auth/forgotPassword?type=forgotPassword`, { email: form.value.email }).subscribe(resp => {
        if (resp?.msg) {
          this.dialogRef.close();
          this.sharedService.openSnackbar(resp?.msg, 6000);
        }
      }, err => {
        this.sharedService.openSnackbar(err.error.msg || 'Internal Server Error');
      })
    }
  }

  resetPassword(form: FormGroup) {
    if (form.invalid) {
      this.snackbar.open('Please enter all fields!', 'Close', {
        duration: 5000
      });
      return;
    } else {
      // Process the form
      this.authService.forgotPassword(`auth/resetPassword?type=resetPassword`, form.value).subscribe(resp => {
        if (resp?.msg) {
          this.dialogRef.close();
          this.sharedService.openSnackbar(resp?.msg, 6000);
        }
      }, err => {
        this.sharedService.openSnackbar(err.error.msg || 'Internal Server Error');
      })
    }
  }


}
