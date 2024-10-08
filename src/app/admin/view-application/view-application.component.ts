import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationsService } from 'src/app/services/applications.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';
import { setUpKeyValueList } from 'src/app/utils/KeyToHumanValue';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.html',
  styleUrls: ['./view-application.component.scss']
})
export class ViewApplicationComponent implements OnInit {
  application: any = {};
  user: any = {};
  statuses: string[] = ['Pending', 'In Review', 'Approved', 'Rejected'];
  updateStatus!: FormGroup;
  marksDoc: any;
  showDoc: boolean = false;
  loading$ = this.loader.loading$;

  personalDetailsList: any;
  addressDetailsList: any;
  documentExtraDataList: any;
  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private sharedService: SharedService, private applicationService: ApplicationsService, private router: Router, private activeRoute: ActivatedRoute, public sanitizer: DomSanitizer, public loader: LoadingService
  ) {
    this.statusUpdateForm();
  }

  ngOnInit(): void {
    this.user = this.sharedService.get('user');
    if (!this.user) this.router.navigate(['auth/login']);
    this.activeRoute.params.subscribe(params => {
      if (params['applicationId']) {
        this.fetchApplication(`?_id=${params['applicationId']}`);
        // this.fetchStudentMarks(`?_id=${params['applicationId']}`);
      }
      else {
        // Return to previous page
      }
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


  fetchApplication(applicationId: string) {
    this.applicationService.genericFetchApplications(`applications/fetchApplications${applicationId}`).subscribe((data: any) => {
      this.application = data[0];
      this.updateStatus.patchValue({ ...this.application?.status });
      this.application.personalDetails.dateOfBirth = new Date(this.application?.personalDetails?.dateOfBirth);
      this.showDoc = Boolean(this.application?.personalDetails?.marksDoc?.file)
      if (this.showDoc) {
        const { file, name, type } = this.application?.personalDetails?.marksDoc;
        this.marksDoc = { file, name: `${name}.${type}` };
      }
      this.makeListData(this.application);
    }, err => {
      console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
    })
  }


  makeListData({ personalDetails, addressDetails, documentExtraData }: any) {
    const personalDetailsKeyList = ['dateOfBirth', 'race', 'gender', 'schoolCurrentlyAttending', 'schoolWishToAttend', 'gradeOrYearOfStudy', 'yearApplyingFor', 'hasGrant', 'grantDetails', 'course', 'fetWishToAttend', 'requestingFor', 'motivation'];
    this.personalDetailsList = setUpKeyValueList(personalDetails, personalDetailsKeyList);

    const addressDetailsKeyList = ['cellOne', 'cellTwo', 'email', 'town', 'city', 'province'];
    this.addressDetailsList = setUpKeyValueList(addressDetails, addressDetailsKeyList);

    if (documentExtraData) {
      const documentExtraDataKeyList = ['race', 'gender', 'schoolName', 'principalContactDetails', 'accountsContactDetails'];
      this.documentExtraDataList = setUpKeyValueList(documentExtraData, documentExtraDataKeyList);
    }
  }
}