import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
    // {
    //   label: 'Confirmation of Section 18A certificate from the school',
    //   name: '',
    //   base64: '',
    //   file: null
    // },
  ]

  activatedRouteSub: Subscription = new Subscription();
  application: any;
  loading$ = this.loaderService.loading$;
  personalDetails!: FormGroup;
  width: number = 0;
  showParentDoc: boolean = false
  constructor(public sanitizer: DomSanitizer, private sharedService: SharedService, private applicationService: ApplicationsService, private activatedRouite: ActivatedRoute, private loaderService: LoadingService, private fb: FormBuilder, private router: Router) {
    this.activatedRouteSub = this.activatedRouite.params.subscribe(params => {
      if (params['applicationId']) {
        this.applicationService.genericFetchApplications(`applications/fetchApplications?_id=${params?.['applicationId']}`).subscribe((data: any) => {
          if (data[0]) {
            this.application = data[0];
            this.showParentDoc = new Date().getFullYear() - +this.application?.personalDetails?.dateOfBirth?.slice(0, 4)  < 18 ? true : false;
            !this.showParentDoc && this.docs.splice(2, 1);
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

  uploadDocs() {
    const allDocsValid = this.docs.every(doc => doc.base64);
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
            current: 'Approved'
          },
          submittedDocs: true,
          checkIfUploaded: true,
          documents: this.docs
        }

        this.updateApplication(body)
      }).catch((err) => {
        this.sharedService.openSnackbar('Something went wrong');
        console.log(err);
      }).finally(() => this.loaderService.hideLoader());
    }
    else {
      this.sharedService.openSnackbar('Please upload all the files and try again');
    }
  }

  updateApplication(data: any) {
    this.loaderService.showLoader();
    this.applicationService.updateApplication(`applications/update/${this.application['_id']}`, data).subscribe((data: any) => {
      this.sharedService.openSnackbar(data?.msg);
      this.loaderService.hideLoader();
      this.router.navigate(['/beneficiary/applications'])
    }, err => {
      console.log(err)
      this.sharedService.openSnackbar(err.error.msg || 'Error Updating Application, Try Again Later.');
    }, () => this.loaderService.hideLoader())
  }

}
