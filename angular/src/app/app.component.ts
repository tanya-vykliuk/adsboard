import { Component } from '@angular/core';
import { TokenStorageService } from './services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  private roles: string[];
  isLoggedIn = false;
  showUserBoard = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  title = 'adsboard';

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    /*this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      
      this.showUserBoard = this.roles.includes('ROLE_USER');
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.name;
    }*/
  }

}
