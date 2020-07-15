import { Component, OnInit } from '@angular/core';
import { AdvertisementService } from '../services/advertisement.service';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.less']
})
export class NavBarComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showUserItems = false;
  showAdminItems = false;
  showManagerItems = false;
  username: string;
  title = 'adsboard';
  waitingApproval;
  email;
  
  constructor(private advertisementService: AdvertisementService,
    private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showUserItems = this.roles.includes('ROLE_USER');
      this.showAdminItems = this.roles.includes('ROLE_ADMIN');
      this.showManagerItems = this.roles.includes('ROLE_MANAGER');

      this.username = user.name;
      this.email = user.email;

      this.advertisementService.CountWaitingAdvertisements()
        .subscribe(
          data => {
           // console.log('waitingApproval= ',data);        
            this.waitingApproval = data;
          },
          error => {
            console.log(error);
          });

    }
  }
  
  logout() {
    this.tokenStorageService.signOut();
    window.location.href = '/';
  }

}
