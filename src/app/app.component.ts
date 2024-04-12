import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from './account/account.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Auth-client';

  accountService: AccountService = inject(AccountService);
  sharedService: SharedService = inject(SharedService);

  private refreshUser(): void {
    const jwt = this.accountService.getJWT();
    if(jwt) {
      this.accountService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: (error) => {
          this.accountService.logout();
          this.sharedService.showNotifications(false, 'Account blocked', error.error);
        }
      });
    } else {
      this.accountService.refreshUser(null).subscribe();
    }
  }

  ngOnInit(): void {
    this.refreshUser();
  }
}
