import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() drawer: any;
  @Input() admin: any;
  @Input() currentPage: any;
  constructor() { }

  ngOnInit(): void {
  }

}
