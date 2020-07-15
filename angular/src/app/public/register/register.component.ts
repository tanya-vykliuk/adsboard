import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackbarService } from 'src/app/services/snackbar.service';

// import custom validator to validate that password and confirm password fields match
import { MustMatch } from './../../_helpers/must-match.validator';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})

export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,100}$/;
  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  submitted = false;
  hide = true;
  matcher = new MyErrorStateMatcher();
  error;
  message;
  
  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    private route: Router,
    private snackBar:SnackbarService) {}

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  ngOnInit() {
   this.registerForm = this.formBuilder.group({
      email: new FormControl('',  
            [Validators.required, 
            Validators.pattern(this.emailPattern),
          ]),
      password: new FormControl('',  
            [Validators.required, 
            Validators.minLength(8),
            Validators.pattern(this.passwordPattern)]),
      confirmpassword: new FormControl('', 
            [Validators.required])
  } , {
     validator: MustMatch('password', 'confirmpassword')
  });
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) { return;}

    return this.userService.register(this.registerForm.value).subscribe(
      data => {
        this.message = data;   
        if(this.message.message){this.snackBar.openSnackBar(this.message.message,'success');}  
        this.error = data;
        if(this.error.error){this.snackBar.openSnackBar(this.error.error,'error');}
        else{         
         this.route.navigate(['/login']);
        }      
      },
      error => {       
        this.snackBar.openSnackBar(error.error,'error');
      });
  }  
}
