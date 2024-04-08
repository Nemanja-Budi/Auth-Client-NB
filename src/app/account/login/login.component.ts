import { Component, inject } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from 'src/app/shared/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/shared/models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;
  submited: boolean = false;
  errorMessages: string[] = [];

  accountService: AccountService = inject(AccountService);
  sharedService: SharedService = inject(SharedService);
  // router: Router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    this.submited = true;
    this.errorMessages = [];
    console.log(this.loginForm.value);

    // if(!this.loginForm.valid) return;
    const newLogin = new Login(this.loginForm.value);

    this.accountService.login(newLogin).subscribe({
      next: (response: any) => {
        this.sharedService.showNotifications(true, response.value.title, response.value.message);
        // this.router.navigateByUrl('/account/login');
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
