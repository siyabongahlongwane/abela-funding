import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-key-value-list',
  templateUrl: './key-value-list.component.html',
  styleUrls: ['./key-value-list.component.scss']
})
export class KeyValueListComponent {
  @Input() dataList: any;

}
