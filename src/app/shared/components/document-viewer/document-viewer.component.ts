import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss']
})
export class DocumentViewerComponent implements OnInit {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() url: string = '';
  @Input() height?: string = '';
  constructor(public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

}
