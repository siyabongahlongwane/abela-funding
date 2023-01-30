import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  ELEMENT_DATA: any[] = [
    { ref: 1, name: 'Siyabonga', surname: "Testing", id: '1234567', status: 'Pending', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 2, name: 'Sne', surname: "Testing", id: '1234567', status: 'Pending', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 3, name: 'Nonhlanhla', surname: "Testing", id: '1234567', status: 'Approved', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 4, name: 'Samke', surname: "Testing", id: '1234567', status: 'Rejected', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 5, name: 'Gordon', surname: "Testing", id: '1234567', status: 'In Review', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 6, name: 'Brian', surname: "Testing", id: '1234567', status: 'Approved', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 7, name: 'Steve', surname: "Testing", id: '1234567', status: 'In Review', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 8, name: 'Beauty', surname: "Testing", id: '1234567', status: 'Approved', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 9, name: 'Florence', surname: "Testing", id: '1234567', status: 'Pending', email: 'test@gmail.com', phone: '0670146942' },
    { ref: 10, name: 'Sphe', surname: "Testing", id: '1234567', status: 'Rejected', email: 'test@gmail.com', phone: '0670146942' },
  ];

  displayedColumns: string[] = ['ref', 'name', 'surname', 'id', 'email', 'phone', 'status', 'action'];
  dataSource = this.ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
