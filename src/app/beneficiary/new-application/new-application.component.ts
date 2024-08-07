import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, startWith, map, Subscription, of, take, takeWhile } from 'rxjs';
import { ApplicationsService } from 'src/app/services/applications.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';
import { SUBJECTS } from 'src/app/utils/subjects';

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
  nextYear: number = new Date().getFullYear() + 1;
  acceptedTerms: boolean = false;
  myControl = new FormControl();
  controls: FormControl[] = [];
  SUBJECTS: Array<string> = [...SUBJECTS];
  filteredOptions!: Observable<string[]>;
  subscriptions: Subscription[] = [];
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private applicationService: ApplicationsService, private router: Router, public loader: LoadingService
  ) {
    this.personalDetails = this.personalDetailsForm();
    this.addressDetails = this.addressDetailsForm();
    this.applicationForm = this.fb.group({
      personalDetails: this.personalDetails,
      addressDetails: this.addressDetails,
      subjects: this.fb.array([]),
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
    this.addSubject();

    this.subjects.valueChanges.pipe(

      map(value => {
        this.controls.forEach((control, index) => {
          control.setValue(value[index].subject)
          const subscription = control.valueChanges.subscribe(change => {
            this.filteredOptions = of(this._filter(change));
          });
          this.subscriptions.push(subscription);
        });
      }),
    ).subscribe();
    // });

    // this.applicationForm.patchValue({
    //   "personalDetails": {
    //     "name": "Blessing",
    //     "surname": "Sangweni",
    //     "dateOfBirth": "1995-02-08T22:00:00.000Z",
    //     "schoolCurrentlyAttending": "Boksburg",
    //     "schoolWishToAttend": "Voortrekker",
    //     "gradeAndYearDoing": "10 in 2025",
    //     "hasGrant": "No",
    //     "grantDetails": "None",
    //     "course": "Engineer",
    //     "motivation": "I aim to be the best Engineer ever!",
    //     "fetWishToAttend": "DUT",
    //     "requestingFor": "School Transfer",
    //     "marksDoc": ""
    //   },
    //   "addressDetails": {
    //     "town": "Boksburg",
    //     "city": "Johannesburg",
    //     "province": "Gauteng",
    //     "cellOne": "0846843654",
    //     "cellTwo": "086054056",
    //     "email": "siyabongcodes@gmail.com"
    //   },
    //   "subjects": []
    // })
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
      subject: [null, [Validators.required]],
      standard: [null, [Validators.required]],
      mark: [null, [Validators.required, Validators.max(100)]],
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
      grantDetails: [null],
      course: [null, Validators.required],
      motivation: [null, [Validators.required]],
      fetWishToAttend: [null, [Validators.required]],
      requestingFor: [null, [Validators.required]],
      marksDoc: [this.isUpload ? this.document : null, this.isUpload ? Validators.required : []],
      acceptedTerms: [null]
    })
  }

  addressDetailsForm(): FormGroup {
    return this.fb.group({
      town: [null],
      city: [null, [Validators.required]],
      province: [null, [Validators.required]],
      cellOne: [null, [Validators.required, Validators.maxLength(13)]],
      cellTwo: [null],
      email: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
    })
  }

  // Dynamically Add Subject
  addSubject() {
    this.subjects.push(this.newSubject());
    this.controls.push(new FormControl());
  }

  // Dynamically Remove Subject
  removeSubject(i: number) {
    if (this.subjects.length != 1) this.subjects.removeAt(i);
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.submitted = true;
    this.personalDetails.patchValue({ acceptedTerms: this.acceptedTerms })
    if (!this.document?.base64) return this.sharedService.openSnackbar('Please upload your report.');
    if (!this.acceptedTerms) return this.sharedService.openSnackbar('Please check the consent box');
    if (this.applicationForm.invalid) {
      this.sharedService.openSnackbar('Please enter all required details!');
      return;
    } else {
      this.saveApplication(this.applicationForm.value);
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
    if (this.document?.file) {

      this.applicationService.uploadFiles([this.document.file]).then((URLs: string[]) => {

        const body = {
          ...this.applicationForm.value,
          personalDetails: { ...this.user?.personalDetails, ...this.personalDetails.value, marksDoc: { name: 'Term Results', file: URLs[0], type: this.document.type } }
        }

        this.startNewApplication(body)
      }).catch((err) => {
        this.sharedService.openSnackbar('Something went wrong');
        console.log(err);
      })
    } else {
      this.startNewApplication(this.applicationForm.value);
    }
  }

  startNewApplication(body: any) {
    this.applicationService.apply(`applications/new`, body).subscribe(resp => {
      if (resp.msg) {
        this.loader.hideLoader();
        this.sharedService.openSnackbar(resp.msg);
        this.router.navigate(['abela/beneficiary/applications/my-applications']);
      }
    }, err => {
      console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Registration failed, Try Again Later.');
    })
  }

  private _filter(value: string): string[] {
    if (!value) return this.SUBJECTS;
    const filterValue = value.toLowerCase();
    return this.SUBJECTS.filter(option => option.toLowerCase().includes(filterValue));
  }
}
