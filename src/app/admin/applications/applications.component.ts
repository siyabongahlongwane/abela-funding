import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  dataSource: any[] = this.ELEMENT_DATA;

  filterButtons: any[] = [
    {
      text: 'All',
      filter: 'all'
    },
    {
      text: 'Pending',
      filter: 'pending'
    },
    {
      text: 'In Review',
      filter: 'in review'
    },
    {
      text: 'Approved',
      filter: 'approved'
    },
    {
      text: 'Rejected',
      filter: 'rejected'
    }
  ]

  selectedFilter: string = '';
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.filterTableData(params['applicationType']);
    })
  }

  filterTableData(filter: string) {
    this.selectedFilter = filter;
    this.dataSource = this.ELEMENT_DATA;
    if (filter !== 'all') {
      this.dataSource = this.ELEMENT_DATA.filter(application => {
        return application.status.toLowerCase() == filter;
      });
    }
  }

}
