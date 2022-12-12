import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:['./login.component.css']
})

export class LoginComponent implements OnInit{
  loginFromGroup: FormGroup|any;
  constructor(private authService: AuthService){}
  ngOnInit(): void {
    console.log('Login Component');
    this.loginFromGroup = new FormGroup({
      email: new FormControl('',
      [Validators.required,
      Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(form: FormGroup)
  {
    console.log(form.value);
    if(form.invalid)
    {
      return;
    }
    this.authService.login(form.controls['email'].value, form.controls['password'].value);
  }
}
