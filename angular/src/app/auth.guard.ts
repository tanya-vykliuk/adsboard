import { Injectable, Inject } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { AuthService } from './services/auth.service'
import { TokenStorageService } from './services/token-storage.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    
  constructor(@Inject(AuthService) private auth: AuthService, private tokenStorageService: TokenStorageService,
  private router:Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {    
    return !!this.tokenStorageService.getToken();
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {   
    return this.canActivate(next, state)
  }
}