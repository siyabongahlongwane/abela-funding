import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  registerForm!: FormGroup;
  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  contactDetails!: FormGroup;
  showPass: boolean = false;
  privileges: any = {};
  role: any = {};
  refId: string = '';
  provinces: string[] = ["Mpumalanga", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Northern Cape", "North West", "Western Cape"];

  constructor(private fb: FormBuilder, private sharedService: SharedService, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      personalDetails: this.personalDetails,
      contactDetails: this.contactDetails,
      addressDetails: this.addressDetails,
      role: new FormGroup({
        id: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required)
      }),
      privileges: this.privileges,
      refId: null,
      password: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.setFormData();
    this.personalDetails = this.personalDetailsForm();
    this.contactDetails = this.contactDetailsForm();
    this.addressDetails = this.addressDetailsForm();
  }

  personalDetailsForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
    })
  }

  contactDetailsForm(): FormGroup {
    return new FormGroup({
      cellOne: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
      cellTwo: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]),
    })
  }

  addressDetailsForm(): FormGroup {
    return new FormGroup({
      town: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      province: new FormControl(null, Validators.required)
    })
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
