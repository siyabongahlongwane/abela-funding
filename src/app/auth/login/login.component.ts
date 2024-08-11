import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from '../auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from 'src/app/shared/forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any = {};
  showPass: boolean = false;
  width: any = 0;
  loading$ = this.loader.loading$;

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private router: Router, private authService: AuthService, public loader: LoadingService, private dialog: MatDialog) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      password: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.width = '';
  }

  login(form: FormGroup) {
    if (form.invalid) {
      this.snackbar.open('Please enter all required fields!', 'Close', {
        duration: 5000
      });
      return;
    } else {
      // Process the form
      this.authService.login(`auth/login?email=${form.value.email}&password=${form.value.password}`).subscribe(resp => {
        if (resp.user) {
          this.sharedService.set('user', resp.user);
          this.sharedService.openSnackbar(resp?.msg);
          this.authService.userSub.next(resp.user);
          if (resp.user.role.description.includes('Admin')) this.router.navigate(['admin/dashboard']);
          else this.router.navigate(['beneficiary/applications/my-applications']);
        }
      }, err => {
        this.sharedService.openSnackbar(err.error.msg || 'Internal Server Error');
      })
    }
  }

  openEmailDialog(action: string) {
    if (action === 'forgot') {
      this.dialog.open(ForgotPasswordComponent, { disableClose: true, width: '320px', data: {action, header: 'Forgot Password'}}).afterClosed().subscribe(res => {
        if(res){
          // Call API
        }
      })
    }
  }

  triggerForgotPassword(email: string){

  }
}
