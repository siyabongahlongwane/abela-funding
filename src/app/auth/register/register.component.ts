import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../auth.service';
import { LoadingService } from 'src/app/services/loading.service';

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
  referrer: any = null;
  width: any = 0;
  loading$ = this.loader.loading$;
  provinces: string[] = ["Mpumalanga", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Northern Cape", "North West", "Western Cape"];
  today = new Date();
  constructor(private fb: FormBuilder, private sharedService: SharedService, private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, @Optional() public dialogRef: MatDialogRef<RegisterComponent>, private userService: UserService, public loader: LoadingService) {
    this.personalDetailsForm();
    this.contactDetailsForm();
    this.addressDetailsForm();
    this.registerForm = this.fb.group({
      personalDetails: this.personalDetailsForm(),
      contactDetails: this.contactDetailsForm(),
      addressDetails: this.addressDetailsForm(),
      role: new FormGroup({
        id: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required)
      }),
      privileges: this.privileges,
      refId: null,
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.registerForm.patchValue({
      "personalDetails": {
          "name": "Blessing",
          "race": "Black",
          "idNumber": "950209",
          "surname": "Sangweni",
          "gender": "Male"
      },
      "contactDetails": {
          "cellOne": "0612905813",
          "cellTwo": null,
          "email": "siyabonga@webgooru.co.za"
      },
      "addressDetails": {
          "town": null,
          "city": "jhb",
          "province": "Mpumalanga"
      },
      "role": {
          "id": "ST",
          "description": "Student"
      },
      "privileges": {},
      "refId": null,
      "password": "123456"
  });
    if (this.data) {
      this.registerForm.patchValue(this.data);
    }
    this.setFormData();
    this.width = '';
    this.personalDetails.get('idNumber')?.valueChanges.subscribe((value) => {
      value.length >= 6 ? this.calculateDateOfBirth(value) : this.personalDetails.get('dateOfBirth')?.setValue(null);
      value.length >= 7 && value.charAt(6) > 4 ? this.personalDetails.get('gender')?.setValue('Male') : this.personalDetails.get('gender')?.setValue('Female');
    })
  }

  personalDetailsForm(): FormGroup {
    this.personalDetails = new FormGroup({
      name: new FormControl(null, Validators.required),
      race: new FormControl(null, Validators.required),
      idNumber: new FormControl(null, Validators.required),
      surname: new FormControl(null, Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
    });
    return this.personalDetails;
  }

  contactDetailsForm(): FormGroup {
    this.contactDetails = new FormGroup({
      cellOne: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
      cellTwo: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]),
    });
    return this.contactDetails;
  }

  addressDetailsForm(): FormGroup {
    this.addressDetails = new FormGroup({
      town: new FormControl(null),
      city: new FormControl(null, Validators.required),
      province: new FormControl(null, Validators.required)
    });
    return this.addressDetails;
  }

  register(form: FormGroup) {
    if (form.invalid) {
      return this.sharedService.openSnackbar('Please enter all required fields correctly!');
    } else {
      this.createRefId();
      this.activatedRoute.queryParams.subscribe(queryParams => {
        if (Object.keys(queryParams).includes('refId')) {
          this.userService.fetchReferrer(`auth/fetchReferrer?refId=${queryParams['refId']}`).subscribe(referrer => {
            if (referrer.length > 0) {
              this.registerForm.value.referrer = referrer[0];
              this.registerForm.value.referralDate = new Date();
              this.saveUserDetails();
            }
          }, err => this.sharedService.openSnackbar(err.error.msg || 'Error fetching Referrer Details'));
        } else {
          this.saveUserDetails();
        }
      });
    }
  }

  setFormData() {
    if (window.location.pathname.includes('admin')) this.registerForm.patchValue({ role: { id: 'Admin', description: 'Admin' } });
    else this.registerForm.patchValue({ role: { id: 'ST', description: 'Student' } });
  }

  createRefId() {
    let refId = this.registerForm.value.personalDetails.name + '-' + (Math.random() + 1).toString(36).substring(2);
    this.registerForm.patchValue({ refId });
  }

  close(data?: any) {
    this.dialogRef.close(data && data || false);
  }

  saveUserDetails() {
    this.authService.register(`auth/register`, this.registerForm.value).subscribe(resp => {
      if (resp.msg) {
        this.sharedService.openSnackbar(resp.msg);
        this.router.navigate(['abela/auth/login']);
      }
    }, err => {
      console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
    })
  }

  calculateDateOfBirth(idNumber: string, cutoffYear = +new Date().getFullYear().toString().slice(1, 4)) {
    // Extract the date of birth portion from the ID number
    const dob = idNumber.slice(0, 6);

    // Convert the date of birth into a date object
    const year = parseInt(dob.slice(0, 2), 10) + (parseInt(dob.slice(0, 2), 10) < cutoffYear ? 2000 : 1900);
    const month = parseInt(dob.slice(2, 4), 10) - 1;
    const day = parseInt(dob.slice(4, 6), 10);
    const dateOfBirth = new Date(year, month, day);

    // Format the date object into the desired format
    this.personalDetails.get('dateOfBirth')?.setValue(dateOfBirth);
  }
}
