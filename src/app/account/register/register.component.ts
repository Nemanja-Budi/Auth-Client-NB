import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Register } from 'src/app/shared/models/register.model';
import { SharedService } from 'src/app/shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submited: boolean = false;
  errorMessages: string[] = [];

  accountService: AccountService = inject(AccountService);
  sharedService: SharedService = inject(SharedService);
  router: Router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    });
  }

  onRegister(): void {
    this.submited = true;
    this.errorMessages = [];

    if(!this.registerForm.valid) return;
    const newRegister = new Register(this.registerForm.value);

    this.accountService.register(newRegister).subscribe({
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
