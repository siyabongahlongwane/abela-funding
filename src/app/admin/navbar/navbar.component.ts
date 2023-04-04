import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() drawer: any;
  @Input() user: any;
  @Input() currentPage: any;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
