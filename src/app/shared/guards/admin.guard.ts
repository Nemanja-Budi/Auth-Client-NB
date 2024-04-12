import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { AccountService } from "src/app/account/account.service";
import { SharedService } from "../shared.service";
import { Router } from "@angular/router";
import { User } from "../models/account/user.model";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {

  constructor(private accountService: AccountService, private sharedService: SharedService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.accountService.user$.pipe(
      map((user: User | null) => {
        if(user) {
          const decodedToket: any = jwtDecode(user.jwt);
          if(decodedToket.role.includes('Admin')) {
            return true;
          }
        }
        this.sharedService.showNotifications(false, 'Admin Area', 'Leave now!');
        this.router.navigateByUrl('/');

        return false;
      })
    );
  }
}