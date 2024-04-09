import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { User } from 'src/app/shared/models/account/user.model';
import { ResetPassword } from 'src/app/shared/models/account/reset-password.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token: string | undefined;
  email: string | undefined;
  submitted: boolean = false;
  errorMessages: string[] = [];
  resetPasswordForm: FormGroup = new FormGroup({});

  accountService: AccountService = inject(AccountService);
  sharedService: SharedService = inject(SharedService);
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  formBuilder: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        }
        else {
          this.activatedRoute.queryParamMap.subscribe({
            next: (params: any) => {
              this.token = params.get('token');
              this.email = params.get('email');
              if(this.token && this.email) {
                this.initializeForm(this.email);
              } else {
                this.router.navigateByUrl('/account/login');
              }
            }
          });
        }
      }
    });
  }

  initializeForm(username: string): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: [{ value: username, disabled: true }],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    });
  }

  onResetPassword() {
    this.submitted = true;
    this.errorMessages = [];

    if(this.resetPasswordForm.valid && this.token && this.email) {
      const resetModel: ResetPassword = {
        token: this.token,
        email: this.email,
        newPassword: this.resetPasswordForm.get('newPassword')?.value
      };
      
      this.accountService.resetPassword(resetModel).subscribe({
        next: (response: any) => {
          this.sharedService.showNotifications(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/account/login');
        },
        error: (error) => {
          if(error.error.errors) {
            this.errorMessages = error.error.errors;
          }
          else {
            this.errorMessages.push(error.error);
          }
        }
      });
    }
  }
}
