import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-icons',
  templateUrl: './share-icons.component.html',
  styleUrls: ['./share-icons.component.scss']
})
export class ShareIconsComponent implements OnInit {
  message: string = '';
  url: string = 'https://apply.theabelatrust.co.za/auth/register';
  @Input() user: any;
  constructor() { }

  ngOnInit(): void {
        this.message = `Looking for educational Support? Need a Bursary? Need Books?
    Is Registration fee a problem....?
    Abela Trust is a registered entity focusing on the upliftment of education in South Africa and aiming to assist as many learners as possible to reach their educational goals.
    To Apply, click on the link: ${this.url}?refId=${this.user.refId}
    Please share this opportunity with someone you know who might need it and you could win yourself a mini tablet or smartphone!`;
  }

  facebook() {
    const facebookApi = `https://www.facebook.com/sharer/sharer.php?u=${this.url}?refId=${this.user.refId}`;
    window.open(facebookApi, '_blank')
  }
  tiktok() {
    const twitterApi = `https://twitter.com/intent/tweet?text=${this.message}`;
    window.open(twitterApi, '_blank')
  }
  whatsapp() {
    window.open(`https://wa.me/?text=${this.message}`, '_blank')

  }
}
