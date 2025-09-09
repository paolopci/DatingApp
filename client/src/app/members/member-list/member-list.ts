import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account';
import { Member } from '../../_models/member';
import { Paginator } from '../../_models/pagination';
import { User } from '../../_models/User';
import { MemberCardComponent } from '../member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, NgbPaginationModule, FormsModule],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private memberService = inject(MembersService);
  private accountService = inject(AccountService);

  members: Member[] = [];
  pageNumber = 1;
  pageSize = 5;
  pagination?: Paginator;

  // Filtri
  gender: string = '';
  minAge: number = 18;
  maxAge: number = 100;
  orderBy: 'created' | 'lastActive' = 'lastActive';
  orderDirection: 'asc' | 'desc' = 'desc';

  private readonly filterStorageKey = 'memberListFilters';

  ngOnInit(): void {
    this.loadFilters();
    const current: User | null = this.accountService.currentUser();
    if (!this.gender && current?.gender) {
      const g = current.gender.toLowerCase();
      this.gender = g === 'male' ? 'female' : g === 'female' ? 'male' : '';
    }
    this.loadMembers();
  }

  loadMembers() {
    this.saveFilters();
    this.memberService.getMembersFiltered({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      gender: this.gender || undefined,
      minAge: this.minAge,
      maxAge: this.maxAge,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection
    }).subscribe({
      next: members => {
        this.members = members;
        const pr = this.memberService.paginatedResult();
        this.pagination = pr?.pagination ?? undefined;
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
    this.pageNumber = 1;
    this.loadMembers();
  }

  applyFilters() {
    this.pageNumber = 1;
    this.loadMembers();
  }

  resetFilters() {
    const current: User | null = this.accountService.currentUser();
    this.gender = current?.gender ? (current.gender.toLowerCase() === 'male' ? 'female' : current.gender.toLowerCase() === 'female' ? 'male' : '') : '';
    this.minAge = 18;
    this.maxAge = 100;
    this.orderBy = 'lastActive';
    this.orderDirection = 'desc';
    this.pageNumber = 1;
    this.loadMembers();
  }

  onSortClick(field: 'created' | 'lastActive') {
    if (this.orderBy === field) {
      this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.orderBy = field;
      this.orderDirection = 'desc';
    }
    this.pageNumber = 1;
    this.loadMembers();
  }

  private saveFilters() {
    const data = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      gender: this.gender,
      minAge: this.minAge,
      maxAge: this.maxAge,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection
    };
    try { localStorage.setItem(this.filterStorageKey, JSON.stringify(data)); } catch {}
  }

  private loadFilters() {
    try {
      const raw = localStorage.getItem(this.filterStorageKey);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (typeof data.pageNumber === 'number') this.pageNumber = data.pageNumber;
      if (typeof data.pageSize === 'number') this.pageSize = data.pageSize;
      if (typeof data.gender === 'string') this.gender = data.gender;
      if (typeof data.minAge === 'number') this.minAge = data.minAge;
      if (typeof data.maxAge === 'number') this.maxAge = data.maxAge;
      if (data.orderBy === 'created' || data.orderBy === 'lastActive') this.orderBy = data.orderBy;
      if (data.orderDirection === 'asc' || data.orderDirection === 'desc') this.orderDirection = data.orderDirection;
    } catch {}
  }
}

