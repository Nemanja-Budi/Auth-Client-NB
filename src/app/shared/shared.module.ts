import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './components/modals/notification/notification.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UserHasRoleDirective } from './directives/user-has-role.directive';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificationComponent,
    UserHasRoleDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    RouterModule,
    ValidationMessagesComponent,
    UserHasRoleDirective,
    ReactiveFormsModule
  ]

})
export class SharedModule { }
