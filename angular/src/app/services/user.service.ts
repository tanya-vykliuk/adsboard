import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  register(registerForm){
    return this.http.post(baseUrl+'user/registration', registerForm);
  }

  login(loginForm){
   // console.log('login(loginForm)  ',baseUrl+'user/login');
    return this.http.post(baseUrl+'user/login',  {
      email: loginForm.email,
      password: loginForm.password
    }, httpOptions);
  }

  confirmRegistration(token){
    return this.http.get(baseUrl+'user/confirmregistration/'+token);
  }

  getUserById(user_id){
    return this.http.get(baseUrl+'user/getUserById/'+user_id);
  }
  getUsersByRoleName(role_name){
    return this.http.get(baseUrl+'user/getUsersByRoleName/'+role_name);
  }
  getUsers(){
    return this.http.get(baseUrl+'user/getUsers');
  }
}
