import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { MemberEditComponent } from '../member-edit/member-edit.component';



@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent, MemberEditComponent],
  standalone: true,
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private memberService = inject(MembersService);
  members: Member[] = [];


  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: members => {
        this.members = members,
          console.log(members);
      },
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
  }

}
