import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-key-value-list',
  templateUrl: './key-value-list.component.html',
  styleUrls: ['./key-value-list.component.scss']
})
export class KeyValueListComponent implements AfterViewInit {
  @Input() dataList: any;
  constructor() { 
    
  }
  
  ngAfterViewInit(): void {
    console.log(this.dataList)
  }

}
