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
  user: any = {};
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      password: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
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
          this.user = resp.user;
          this.sharedService.set('user', this.user);
          this.router.navigate(['abela/admin/dashboard']);
          this.snackbar.open('Logged in', 'Close', {
            duration: 3000
          });
          if (resp.user.role.description.includes('Admin')) this.router.navigate(['abela/admin/dashboard']);
          else this.router.navigate(['/beneficiary/dashboard']);
        }
      })
    }
  }

}
