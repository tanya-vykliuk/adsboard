import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-userconfirmation',
  templateUrl: './userconfirmation.component.html',
  styleUrls: ['./userconfirmation.component.less']
})
export class UserconfirmationComponent implements OnInit {
  error: any;
  message;
  token;

  constructor(private userService: UserService,private route: ActivatedRoute, 
            private router: Router, private snackBar:SnackbarService) { 
    this.token = this.route.snapshot.paramMap.get('token');
    this.confirmUser(this.token);
  }


  ngOnInit() {
  }

  confirmUser(token) {  
      return this.userService.confirmRegistration(token).subscribe(
        data => {
          this.message = data;   
          if(this.message.message){this.snackBar.openSnackBar(this.message.message,'success');}  
          this.error = data;
          if(this.error.error){this.snackBar.openSnackBar(this.error.error,'error');}
          this.router.navigate(['/login']);
          },
        error => {
          this.snackBar.openSnackBar(error.error,'error');
          this.router.navigate(['/login']);
        });
  }

}
