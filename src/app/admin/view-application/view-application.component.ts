import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService } from 'src/app/services/applications.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})
export class ViewApplicationComponent implements OnInit {
  application: any = {};
  applicationForm!: FormGroup;
  personalDetails!: FormGroup;
  addressDetails!: FormGroup;
  updateStatus!: FormGroup;
  isLinear = false;
  isUpload: any;
  provinces: string[] = ["Mpumalanga", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Northern Cape", "North West", "Western Cape"];
  standards: string[] = ['SG - Standard Grade', 'HG - Higher Grade', 'AP - Advance Programme'];
  statuses: string[] = ['Pending', 'In Review', 'Approved', 'Rejected'];
  options: string[] = ['Yes', 'No'];
  user: any = {};
  hasGrant: boolean = false;
  submitted: boolean = false;
  document: any = null;
  marksDoc: any;
  showDoc: boolean = false;

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private applicationService: ApplicationsService, private router: Router, private activeRoute: ActivatedRoute, public sanitizer: DomSanitizer
  ) {
    this.personalDetails = this.personalDetailsForm();
    this.addressDetails = this.addressDetailsForm();
    this.applicationForm = this.fb.group({
      personalDetails: this.personalDetails,
      addressDetails: this.addressDetails,
      subjects: this.fb.array([]),
      favouriteSubject: [null, [Validators.required]]
    });
    this.statusUpdateForm();
  }

  ngOnInit(): void {
    this.user = this.sharedService.get('user');
    if (!this.user) this.router.navigate(['abela/auth/login']);
    this.activeRoute.params.subscribe(params => {
      if (params['applicationId']) {
        this.fetchApplication(`?_id=${params['applicationId']}`);
        this.fetchStudentMarks(`?_id=${params['applicationId']}`);
      }
      else {
        // Return to previous page
      }
    })
  }

  toggleState(state: boolean) {
    this.isUpload = state;
    let length = this.subjects.length;
    if (!this.isUpload) {
      this.applicationForm.value.personalDetails.marksDoc = null;
      if (length === 0) {
        this.addSubject();
      }
    } else {
      this.subjects.clear();
    }
  }

  // Getter method to return the subjects formArray from the applicationsForm
  get subjects(): FormArray {
    return this.applicationForm.get('subjects') as FormArray;
  }

  newSubject(): FormGroup {
    return this.fb.group({
      subject: [null, !this.isUpload ? [Validators.required] : []],
      standard: [null, !this.isUpload ? [Validators.required] : []],
      mark: [null, !this.isUpload ? [Validators.required, Validators.max(100)] : []],
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
      hasGrant: [null, Validators.required],
      grantDetails: [null, [Validators.required]],
      course: [null, Validators.required],
      motivation: [null, [Validators.required]],
      fetWishToAttend: [null, [Validators.required]],
      requestingFor: [null, [Validators.required]],
      marksDoc: [this.isUpload ? this.document : null, this.isUpload ? Validators.required : []]
    })
  }

  addressDetailsForm(): FormGroup {
    return this.fb.group({
      town: [null, [Validators.required]],
      city: [null, [Validators.required]],
      province: [null, [Validators.required]],
      cellOne: [null, [Validators.required, Validators.maxLength(13)]],
      cellTwo: [null],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
    })
  }

  statusUpdateForm() {
    this.updateStatus = this.fb.group({
      comment: [null, []],
      current: [null, [Validators.required]]
    })
  }

  statusUpdate(form: any) {
    this.applicationService.updateApplication(`applications/update/${this.application['_id']}`, form.value).subscribe((data: any) => {
      this.sharedService.openSnackbar(data?.msg);
      this.fetchApplication(`?_id=${this.application['_id']}`);
    }, err => {
console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Error Updating Application, Try Again Later.');
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
    this.submitted = true;
    if (this.applicationForm.invalid) {
      this.sharedService.openSnackbar('Please enter all required details!');
      return;
    } else {
      this.saveApplication(this.applicationForm.value)
    }
  }

  uploadDoc($event: any): void {
    if ($event) {
      this.readThis($event.target);
    }
  }

  readThis(inputValue: any): void {
    if (inputValue) {
      let file: File = inputValue.files[0];

      if (['jpeg', 'jpg', 'pdf', 'png'].includes(file.type.split('/')[1])) {
        let myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
          this.applicationForm.value.personalDetails.marksDoc = this.document = {
            base64: myReader.result,
            name: file.name
          };
        }
        myReader.readAsDataURL(file);
      }
      else {
        return this.sharedService.openSnackbar('Please upload either an image or a pdf');
      }
    }
  }

  prepopulateForm(application: any) {
    this.applicationForm.patchValue(application);
    this.updateStatus.patchValue(application?.status);
  }

  toggleDetailsInput(answer: string) {
    this.hasGrant = answer == 'Yes' ? true : false;
  }

  saveApplication(form: any) {
    form['owner'] = this.applicationForm?.value?.personalDetails?.email;
    this.applicationService.apply(`applications/new`, form).subscribe(resp => {
      if (resp.msg) {
        this.sharedService.openSnackbar(resp.msg);
        this.router.navigate(['abela/beneficiary/applications/all']);
        // this.router.navigate(['abela/beneficiary/dashboard']);
      }
    }, err => {
console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
    })
  }

  fetchApplication(applicationId: string) {
    this.applicationService.genericFetchApplications(`applications/fetchApplications${applicationId}`).subscribe((data: any) => {
      this.application = data[0];
      this.application.personalDetails.dateOfBirth = new Date(this.application.personalDetails.dateOfBirth)
      this.prepopulateForm(this.application);

    }, err => {
console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
    })
  }

  fetchStudentMarks(applicationId: string) {
    this.applicationService.fetchMarks(`applications/fetchMarksDocument${applicationId}`).subscribe((data: any) => {
      if (data?.base64) {
        this.marksDoc = data;
        this.showDoc = true;
      }
      this.application.personalDetails.dateOfBirth = new Date(this.application.personalDetails.dateOfBirth)
      this.prepopulateForm(this.application);

    }, err => {
console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Document, Try Again Later.');
    })
  }
}