import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: any = {};
  showPass: boolean = false;
  privileges: any = {};
  role: any = {};
  refId: string = '';
  constructor(private fb: FormBuilder, private sharedService: SharedService, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      cellOne: [null],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      password: [null, [Validators.required]],
      role: this.fb.group({
        id: [null, Validators.required],
        description: [null, Validators.required]
      }),
      privileges: this.privileges,
      refId: null
    })
  }

  ngOnInit(): void {
    this.setFormData();
  }

  register(form: FormGroup) {
    if (form.invalid) {
      return this.sharedService.openSnackbar('Please enter all required fields correctly!');
    } else {
      // Process the form
      this.createRefId();
      this.authService.register(`auth/register`, this.registerForm.value).subscribe(resp => {
        if (resp.msg) {
          this.sharedService.openSnackbar(resp.msg);
          this.router.navigate(['abela/auth/login']);
        }
      }, err => {
        this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
      })
    }
  }

  setFormData() {
    if (window.location.pathname.includes('admin')) this.registerForm.patchValue({ role: { id: 'Admin', description: 'Admin' } });
    else this.registerForm.patchValue({ role: { id: 'ST', description: 'Student' } });
  }

  createRefId() {
    let refId = this.registerForm.value.name + '-' + (Math.random() + 1).toString(36).substring(2);
    this.registerForm.patchValue({ refId });
  }
}
