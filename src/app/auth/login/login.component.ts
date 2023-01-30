import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any = {};
  showPass: boolean = false;
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern('[0-9]{13}')]],
      password: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  login(form: FormGroup) {
    console.log(form.value)
  }

}
