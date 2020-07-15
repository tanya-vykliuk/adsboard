import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.less']
})
export class MyAccountComponent implements OnInit {
user;
user_id = 3;
  constructor(private userService:UserService, private tokenStorage: TokenStorageService) {    
   }

  ngOnInit() {
    this.getUser();    
  }

  getUser(){
    this.userService.getUserById(this.tokenStorage.getUser().id).subscribe(
      data => {
        this.user = data;
        console.log(this.user);
      },
      error => {
        console.log(error);
      });
  }

}
