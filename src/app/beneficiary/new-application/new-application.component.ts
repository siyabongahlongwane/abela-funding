import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss']
})
export class NewApplicationComponent implements OnInit {
  applicationForm!: FormGroup;
  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  isLinear = false;
  isUpload: any;
  provinces: string[] = ["Mpumalanga", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Northern Cape", "North West", "Western Cape"];
  standards: string[] = ['SG - Standard Grade', 'HG - Higher Grade', 'AP - Advance Programme'];
  user: any = {};
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService) {
    this.personalDetails = this.personalDetailsForm();
    this.addressDetails = this.addressDetailsForm();
    this.applicationForm = this.fb.group({
      personalDetails: this.personalDetails,
      addressDetails: this.addressDetails,
      subjects: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.addSubject();
    this.sharedService.get('user');
    this.prepopulateForm();
  }

  toggleState(state: boolean) {
    this.isUpload = state;
    console.log(this.isUpload);
  }

  // Getter method to return the subjects formArray from the applicationsForm
  get subjects(): FormArray {
    return this.applicationForm.get('subjects') as FormArray;
  }

  newSubject(): FormGroup {
    return this.fb.group({
      subject: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      mark: [null, [Validators.required, Validators.max(100)]]
    })
  }

  personalDetailsForm(): FormGroup {
    return this.fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      schoolCurrentlyAttending: [null, [Validators.required]],
      schoolWishToAttend: [null, [Validators.required]],
      gradeAndYearDoing: [null, [Validators.required]],
    })
  }

  addressDetailsForm(): FormGroup {
    return this.fb.group({
      town: [null, [Validators.required]],
      city: [null, [Validators.required]],
      province: [null, [Validators.required]],
      cellOne: [null, [Validators.required, Validators.maxLength(10)]],
      cellTwo: [null, [Validators.required, Validators.maxLength(10)]],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
    })
  }

  // Dynamically Add Subject
  addSubject() {
    if (this.subjects.length === 9) this.snackbar.open('Max 9 subjects allowed!', 'OK');
    else this.subjects.push(this.newSubject());
  }

  // Dynamically Remove Subject
  removeSubject(i: number) {
    if (this.subjects.length != 1) this.subjects.removeAt(i);
  }

  onSubmit() {
    console.log(this.applicationForm.value)
  }

  prepopulateForm() {
    console.log(this.user);
    this.personalDetailsForm().patchValue(this.user);
  }
}
