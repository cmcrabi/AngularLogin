import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})

export class RegisterComponent implements OnInit{
  loginFromGroup: FormGroup|any;

  constructor(private authService: AuthService){

  }

  ngOnInit(): void {
    console.log('register component');
    this.loginFromGroup = new FormGroup({
      email: new FormControl('',
      [Validators.required,
      Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  onSubmit(form: FormGroup)
  {
    console.log(form.value);
    console.log(form.controls['email'].value);
    this.authService.createUser(form.controls['email'].value, form.controls['password'].value)
  }
}
