import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

import { TokenStorageService } from '../../services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,100}$/;
  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  submitted = false;
  hide = true;
  matcher = new MyErrorStateMatcher();
  message;
  error;
  isLoggedIn = false;
  isLoginFailed = false;
  roles: string[] = [];

  res:any;
  return;

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  constructor(private formBuilder: FormBuilder, 
    private userService: UserService, 
    private snackBar:SnackbarService,
   // private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }

    this.loginForm = this.formBuilder.group({
      email: new FormControl('',  
            [Validators.required, 
            Validators.pattern(this.emailPattern)]),
      password: new FormControl('',  
            [Validators.required, 
            Validators.minLength(8),
            Validators.pattern(this.passwordPattern)])
    });
  }

  onSubmit(){    
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
      this.userService.login(this.loginForm.value).subscribe(
        data => {          
          this.res= data;
          this.tokenStorage.saveToken(this.res.accessToken);
          this.tokenStorage.saveUser(this.res);
  
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getUser().roles;
          this.reloadPage();
         // this.router.navigateByUrl(this.return);
        },
        error => {
          this.snackBar.openSnackBar(error.error,'error');
          //this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
  }

  reloadPage() {
    window.location.href = '/';
  }

}
