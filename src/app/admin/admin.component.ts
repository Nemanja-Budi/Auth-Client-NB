import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { AdminService } from './admin.service';
import { SharedService } from '../shared/shared.service';
import { MemberView } from '../shared/models/admin/memberView.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  members: MemberView[] = [];
  memberToDelete: MemberView | undefined;
  modalRef?: BsModalRef;

  adminService: AdminService = inject(AdminService);
  sharedService: SharedService = inject(SharedService);
  modalService: BsModalService = inject(BsModalService);

  ngOnInit(): void {
    this.adminService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
      }
    });
  }

  onLockMember(id: string): void {
    this.adminService.lockMember(id).subscribe({
      next: () => {
        this.handleLockUnlockFilterAndMessage(id, true);
      }
    });
  }

  onUnlockMember(id: string): void {
    this.adminService.unlockMember(id).subscribe({
      next: () => {
        this.handleLockUnlockFilterAndMessage(id, false);
      }
    });
  }

  onDeleteMember(id: string, template: TemplateRef<any>): void {
    let member = this.findMember(id);
    if(member) {
      this.memberToDelete = member;
      this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }
  }

  confirm(): void {
    if(this.memberToDelete) {
      this.adminService.deleteMember(this.memberToDelete.id).subscribe({
        next: () => {
          this.sharedService.showNotifications(true,'Deleted', `Member of ${this.memberToDelete?.userName} has been deleted!`);
          this.members = this.members.filter(x => x.id !== this.memberToDelete?.id);
          this.memberToDelete = undefined;
          this.modalRef?.hide();
        }
      });
    }
  }

  decline(): void {
    this.memberToDelete = undefined;
    this.modalRef?.hide();
  }

  private handleLockUnlockFilterAndMessage(id: string, locking: boolean) {
    let member = this.findMember(id);
    if(member) {
      member.isLocked = !member.isLocked;
      if(locking) {
        this.sharedService.showNotifications(true,'Locked', `${member.userName} member has been locked`);
      }
      else {
        this.sharedService.showNotifications(true,'Unlocked', `${member.userName} member has been unlocked`);
      }
    }
  }

  private findMember(id: string): MemberView | undefined {
    let member = this.members.find(x => x.id ===id);
    if(!member) return undefined;
    return member;
  }
}
