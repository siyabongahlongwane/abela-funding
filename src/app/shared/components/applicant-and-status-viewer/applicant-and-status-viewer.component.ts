import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-applicant-and-status-viewer',
  templateUrl: './applicant-and-status-viewer.component.html',
  styleUrls: ['./applicant-and-status-viewer.component.scss']
})
export class ApplicantAndStatusViewerComponent implements OnInit {
  @Input() application: any;
  constructor() { }

  ngOnInit(): void {
  }

}
