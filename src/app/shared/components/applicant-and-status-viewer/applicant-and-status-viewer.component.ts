import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-applicant-and-status-viewer',
  templateUrl: './applicant-and-status-viewer.component.html',
  styleUrls: ['./applicant-and-status-viewer.component.scss']
})
export class ApplicantAndStatusViewerComponent implements OnInit {
  @Input() application: any;
  width: number = this.shared.detectScreenSize();
  constructor(private shared: SharedService) { }

  ngOnInit(): void {
  }

}
