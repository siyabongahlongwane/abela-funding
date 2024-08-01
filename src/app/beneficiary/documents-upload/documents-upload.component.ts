import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApplicationsService } from 'src/app/services/applications.service';
import { LoadingService } from 'src/app/services/loading.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.scss']
})
export class DocumentsUploadComponent implements OnInit {
  docs: any[] = [
    {
      label: 'Statement of Fees / Invoice',
      name: '',
      base64: '',
      file: null
    },
    {
      label: 'Your ID / Birth Certificate Copy',
      name: '',
      base64: '',
      file: null
    },
    {
      label: 'Parent / Guardian ID Copy',
      name: '',
      base64: '',
      file: null
    },
    {
      label: 'Confirmation of Section 18A certificate from the school',
      name: '',
      base64: '',
      file: null
    },
  ]

  activatedRouteSub: Subscription = new Subscription();
  application: any;
  loading$ = this.loaderService.loading$;
  personalDetails!: FormGroup;
  width: number = 0;

  constructor(public sanitizer: DomSanitizer, private sharedService: SharedService, private applicationService: ApplicationsService, private activatedRouite: ActivatedRoute, private loaderService: LoadingService, private fb: FormBuilder) {
    this.personalDetails = this.personalDetailsForm();
    this.activatedRouteSub = this.activatedRouite.params.subscribe(params => {
      if (params['applicationId']) {
        this.applicationService.genericFetchApplications(`applications/fetchApplications?_id=${params?.['applicationId']}`).subscribe((data: any) => {
          if (data[0]) {
            this.application = data[0];
            this.application.personalDetails.dateOfBirth = new Date(this.application?.personalDetails?.dateOfBirth);
            const { name, surname } = this.application.personalDetails;
            this.personalDetails.patchValue({ name, surname });
          }
          else throw new Error('Error Fetching Application, Try Again Later.');
        }, err => {
          console.log(err)
          this.sharedService.openSnackbar(err.error.msg || 'Error Fetching Application, Try Again Later.');
        })
      }
    })
    this.width = this.sharedService.detectScreenSize();
  }

  ngOnInit(): void {
  }

  uploadDoc($event: any, index: number): void {
    if ($event) {
      this.readThis($event.target, index);
    }
  }

  readThis(inputValue: any, index: number): void {
    if (inputValue) {
      let file: File = inputValue.files[0];
      const fileType = file.type.split('/')[1] == 'pdf' ? 'pdf' : 'img';
      if (['jpeg', 'jpg', 'pdf', 'png'].includes(file.type.split('/')[1])) {
        let myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
          this.docs[index] = {
            ...this.docs[index],
            base64: myReader.result,
            name: file.name,
            file: file,
            type: file.type.split('/')[1] == 'pdf' ? 'pdf' : 'img'
          };
          console.log(file, this.docs[index])
        }
        try {
          if (fileType !== 'pdf') return myReader.readAsDataURL(file);
          myReader.readAsArrayBuffer(file);
        } catch (error) {
          console.log(error)
        }

      }
      else {
        return this.sharedService.openSnackbar('Please upload either an image or a pdf');
      }
    }
  }

  uploadDocs(form: FormGroup) {
    const allDocsValid = this.docs.every(doc => doc.base64) && form.valid;
    if (allDocsValid) {
      this.loaderService.showLoader();

      const files = this.docs.map(doc => doc.file);
      this.applicationService.uploadFiles(files).then((URLs: string[]) => {
        this.docs = this.docs.map((doc, i) => {
          delete doc.base64;
          delete doc.type;
          return { ...doc, file: URLs[i] }
        })
        const body = {
          ...this.application,
          status: {
            comment: 'Awaiting verification...',
            current: 'Documents Uploaded'
          },
          submittedDocs: true,
          documents: this.docs,
          documentExtraData: form.value
        }

        this.updateApplication(body)
      }).catch((err) => {
        this.sharedService.openSnackbar('Something went wrong');
        console.log(err);
      }).finally(() => this.loaderService.hideLoader());
    }
    else {
      this.sharedService.openSnackbar('Please add all required info');
    }
  }

  updateApplication(data: any) {
    this.loaderService.showLoader();
    this.applicationService.updateApplication(`applications/update/${this.application['_id']}`, data).subscribe((data: any) => {
      this.sharedService.openSnackbar(data?.msg);
      this.loaderService.hideLoader();
    }, err => {
      console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Error Updating Application, Try Again Later.');
    }, () => this.loaderService.hideLoader())
  }

  personalDetailsForm(): FormGroup {
    return this.fb.group({
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      race: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      schoolName: [null, [Validators.required]],
      principalContactDetails: [null, [Validators.required]],
      accountsContactDetails: [null, [Validators.required]],
    })
  }

}
