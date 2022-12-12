import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { IAuthData } from "./IAuthData";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService{
  private token :string | any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http:HttpClient, private router:Router){}

  getToken()
  {
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
   return this.authStatusListener.asObservable();
  }

  createUser(email: String, password: String){
    const authData: IAuthData = { email: email, password: password};
    this.http.post("http://localhost:3000/api/signup", authData)
    .subscribe(response => {
      console.log(response);
    });
  }

  login(email: string, password: String){
    const authData: IAuthData = { email: email, password: password};
    this.http.post<{token: string}>("http://localhost:3000/api/login", authData)
    .subscribe(response=>{
      this.token = response.token;
      if(response.token)
      {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      }
    })
  }

  logout()
  {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
