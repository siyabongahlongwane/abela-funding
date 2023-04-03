import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any = {};
  showPass: boolean = false;
  width: any = 0;
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      password: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.width = '';
    console.log(this.width);
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
          if (resp.user.role.description.includes('Admin')) this.router.navigate(['abela/admin/dashboard']);
          else this.router.navigate(['abela/beneficiary/applications/my-applications']);
        }
      }, err => {
        this.sharedService.openSnackbar(err.error.msg || 'Internal Server Error');
      })
    }
  }

}
