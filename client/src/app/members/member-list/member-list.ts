import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Paginator } from '../../_models/pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent, NgbPaginationModule],
  standalone: true,
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private memberService = inject(MembersService);
  members: Member[] = [];
  pageNumber = 1;
  pageSize = 5;
  pagination?: Paginator;
  pages: number[] = [];


  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: members => {
        this.members = members;
        const pr = this.memberService.paginatedResult();
        this.pagination = pr?.pagination ?? undefined;
        this.pages = Array.from({ length: this.pagination?.totalPages ?? 0 }, (_, i) => i + 1);
      },
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
  }

  pageChanged(page: number) {
    if (this.pageNumber === page) return;
    const last = this.pagination?.totalPages ?? 1;
    this.pageNumber = Math.min(Math.max(page, 1), last);
    this.loadMembers();
  }

  onPageSizeChange(value: string | number) {
    const newSize = Number(value);
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    if (this.pageSize === newSize) return;
    this.pageSize = newSize;
    this.pageNumber = 1; // resetto alla prima pagina quando cambia la dimensione
    this.loadMembers();
  }

}
