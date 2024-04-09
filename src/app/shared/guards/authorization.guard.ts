import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { User } from '../models/account/user.model';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})

export class AuthorizationGuard {

  accountService: AccountService = inject(AccountService);
  sharedService: SharedService = inject(SharedService);
  router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.accountService.user$.pipe(
      map((user: User | null) => {
        if(user) {
          return true;
        }
        else {
          this.sharedService.showNotifications(false,'Restricted Area', 'Leave immediately!');
          this.router.navigate(['account/login'], { queryParams: { returnUrl: state.url }});
          return false;
        }
      })
    );
  }
}
