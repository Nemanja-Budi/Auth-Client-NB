import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user.model';
import { ConfirmEmail } from 'src/app/shared/models/account/confirm-email.model';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit{

  success: boolean = true;

  accountService: AccountService = inject(AccountService);
  sharedService: SharedService = inject(SharedService);
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);


  onResendEmailConfirmationLink(): void {
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
  }

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        } else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              const confirmEmail: ConfirmEmail = {
                token: params.get('token'),
                email: params.get('email')
              };

              this.accountService.confirmEmail(confirmEmail).subscribe({
                next: (response: any) => {
                  this.sharedService.showNotifications(true, response.value.title, response.value.message);
                },
                error: (error) => {
                  this.success = false;
                  this.sharedService.showNotifications(false,"Failed", error.error);
                }
              });
            }
          });
        }
      }
    });
  }
}
