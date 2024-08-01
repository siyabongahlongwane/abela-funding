import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApplicationsService } from 'src/app/services/applications.service';
import { LoadingService } from 'src/app/services/loading.service';
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
  options: string[] = ['Yes', 'No'];
  user: any = {};
  hasGrant: boolean = false;
  submitted: boolean = false;
  document: any = null;
  max: Date = new Date();
  width: number = 0;
  orientation: any = 'horizontal';
  loading$ = this.loader.loading$;

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private applicationService: ApplicationsService, private router: Router, public loader: LoadingService
  ) {
    this.personalDetails = this.personalDetailsForm();
    this.addressDetails = this.addressDetailsForm();
    this.applicationForm = this.fb.group({
      personalDetails: this.personalDetails,
      addressDetails: this.addressDetails,
      subjects: this.fb.array([]),
      favouriteSubject: [null, [Validators.required]]
    });
    this.width = this.sharedService.detectScreenSize();
    if (window.innerWidth <= 768) {
      this.orientation = 'vertical';
    } else {
      this.orientation = 'horizontal';
    }
  }

  ngOnInit(): void {
    this.prepopulateForm();
    this.applicationForm.patchValue({
      "personalDetails": {
        "name": "Siyabonga",
        "surname": "Hlongwane",
        "dateOfBirth": "2000-02-22T22:00:00.000Z",
        "schoolCurrentlyAttending": "Boksburg",
        "schoolWishToAttend": "Voortrekker",
        "gradeAndYearDoing": "9 in 2025",
        "hasGrant": "No",
        "grantDetails": "None",
        "course": "Doctor",
        "motivation": "I work hard bro.",
        "fetWishToAttend": "DUT",
        "requestingFor": "Bursary",
        "marksDoc": ""
      },
      "addressDetails": {
        "town": "Boksburg",
        "city": "Johannesburg",
        "province": "Gauteng",
        "cellOne": "0846843654",
        "cellTwo": "086054056",
        "email": "siyabonga@webgooru.co.za"
      },
      "subjects": [],
      "favouriteSubject": "Maths."
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
            name: file.name,
            file,
            type: file.type.split('/')[1]
          };
        }
        myReader.readAsDataURL(file);
      }
      else {
        return this.sharedService.openSnackbar('Please upload either an image or a pdf');
      }
    }
  }

  prepopulateForm() {
    this.user = this.sharedService.get('user');
    const addressDetails = Object.assign(this.user?.addressDetails, this.user?.contactDetails);
    const userDetails = Object.assign({}, this.user?.personalDetails);
    this.personalDetails.patchValue(userDetails);
    this.addressDetails.patchValue(addressDetails);
  }

  toggleDetailsInput(answer: string) {
    this.hasGrant = answer == 'Yes' ? true : false;
  }

  saveApplication(form: any) {
    form['dateCreated'] = new Date();
    form['dateModified'] = null;
    this.loader.showLoader();
    this.applicationService.uploadFiles([this.document.file]).then((URLs: string[]) => {

      const body = {
        ...this.applicationForm.value,
        personalDetails: { ...this.personalDetails.value, marksDoc: { name: 'Term Results', file: URLs[0],type: this.document.type } }
      }

      this.startNewApplication(body)
    }).catch((err) => {
      this.sharedService.openSnackbar('Something went wrong');
      console.log(err);
    }).finally(() => this.loader.hideLoader());
  }

  startNewApplication(body: any) {
    this.applicationService.apply(`applications/new`, body).subscribe(resp => {
      if (resp.msg) {
        this.sharedService.openSnackbar(resp.msg);
        this.router.navigate(['abela/beneficiary/applications/my-applications']);
      }
    }, err => {
      console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
    })
  }
}
