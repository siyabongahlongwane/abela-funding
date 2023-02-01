import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any = {};
  showPass: boolean = false;
  admin: any = {
    firstName: 'Nthabiseng',
    lastName: 'Lempe',
    email: 'nthabiseng@abelatrust.co.za',
    role: {
      id: 'SA',
      description: 'Super Admin',
    },
    privileges: {
      canAdd: true,
      canView: true,
      canDelete: true,
      canEdit: true,
    }
  }
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private router: Router) {
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
      if (true) {
        this.sharedService.set('user', this.admin);
        this.router.navigate(['abela/admin/dashboard']);
        this.snackbar.open('Logged in', 'Close', {
          duration: 3000
        });
      }
    }
  }

}
