import { Component, OnInit, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/shared/models/account/user.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {

  emailForm: FormGroup = new FormGroup({});
  submited: boolean = false;
  mode: string | undefined;
  errorMessages: string[] = [];

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
        } else {
          const mode = this.activatedRoute.snapshot.paramMap.get('mode');
          if(mode) {
            this.mode = mode;
            this.initializeForm();
          }
        }
      }
    });  
  }

  initializeForm(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
    });
  }

  sendEmail(): void {
    this.submited = true;
    this.errorMessages = [];

    if(this.emailForm.valid && this.mode) {
      if(this.mode.includes('resend-email-confirmation-link')) {
        this.accountService.resendEmailConfirmationLink(this.emailForm.get('email')?.value).subscribe({
          next: (response: any) => {
            this.sharedService.showNotifications(true,response.value.title, response.value.message);
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
      } else if(this.mode.includes('forgot-username-or-password')) {
        this.accountService.forgotUsernameOrPassword(this.emailForm.get('email')?.value).subscribe({
          next: (response: any) => {
            this.sharedService.showNotifications(true,response.value.title, response.value.message);
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

  onCancel(): void {
    this.router.navigateByUrl('/account/login');
  }
}
