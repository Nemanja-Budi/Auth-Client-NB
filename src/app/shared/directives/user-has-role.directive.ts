import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { jwtDecode } from "jwt-decode";


@Directive({
  selector: '[appUserHasRole]'
})
export class UserHasRoleDirective implements OnInit{

  @Input() appUserHasRole: string[] = [];

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user) => {
        if(user) {
          const decodedToket: any = jwtDecode(user.jwt);
          if(decodedToket.role.some((role: any) => this.appUserHasRole.includes(role))) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          } else {
            this.viewContainerRef.clear();
          }
        } else {
          this.viewContainerRef.clear();
        }
      }
    });
  }

}
