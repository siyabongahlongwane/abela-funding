import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() drawer: any;
  @Input() user: any;
  @Input() currentPage: any;
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

}
