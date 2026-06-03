import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../_models/User';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Store } from '@ngrx/store';
import { membersActions } from '../state/members.actions';
import { membersFeature } from '../state/members.reducer';
import { authFeature } from '../../auth/state/auth.reducer';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, NgbPaginationModule, NgbTooltipModule, FormsModule, AsyncPipe],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private store = inject(Store);
  members$ = this.store.select(membersFeature.selectMembers);
  pagination$ = this.store.select(membersFeature.selectPagination);
  private params = this.store.selectSignal(membersFeature.selectParams);
  private currentUser = this.store.selectSignal(authFeature.selectCurrentUser);

  pageNumber = 1;
  pageSize = 5;

  // Filtri
  gender: string = '';
  minAge: number = 18;
  maxAge: number = 100;
  orderBy: 'created' | 'lastActive' = 'lastActive';
  orderDirection: 'asc' | 'desc' = 'desc';
  orderDirByField: Record<'created' | 'lastActive', 'asc' | 'desc'> = { created: 'desc', lastActive: 'desc' };

  ngOnInit(): void {
    const r = this.params();
    this.pageNumber = r.pageNumber;
    this.pageSize = r.pageSize;
    this.gender = r.gender ?? '';
    this.minAge = typeof r.minAge === 'number' ? r.minAge : 18;
    this.maxAge = typeof r.maxAge === 'number' ? r.maxAge : 100;
    this.orderBy = r.orderBy ?? 'lastActive';
    this.orderDirection = r.orderDirection ?? 'desc';
    const current: User | null = this.currentUser();
    if (!this.gender && current?.gender) {
      const g = current.gender.toLowerCase();
      this.gender = g === 'male' ? 'female' : g === 'female' ? 'male' : '';
    }
    this.loadMembers();
  }

  loadMembers() {
    this.store.dispatch(membersActions.memberParamsChanged({ params: {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      gender: this.gender || undefined,
      minAge: this.minAge,
      maxAge: this.maxAge,
      orderBy: this.orderBy,
      orderDirection: this.orderDirection
    }}));
  }

  pageChanged(page: number) {
    if (this.pageNumber === page) return;
    const last = this.store.selectSignal(membersFeature.selectPagination)()?.totalPages ?? 1;
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
    const current: User | null = this.currentUser();
    const resetGender = current?.gender ? (current.gender.toLowerCase() === 'male' ? 'female' : current.gender.toLowerCase() === 'female' ? 'male' : undefined) : undefined;
    this.store.dispatch(membersActions.memberParamsReset({ gender: resetGender }));
    const r = this.params();
    // Apply defaults from service
    this.pageNumber = r.pageNumber;
    this.pageSize = r.pageSize;
    // keep the opposite-gender default if available
    this.gender = resetGender ?? (r.gender ?? '');
    this.minAge = typeof r.minAge === 'number' ? r.minAge : 18;
    this.maxAge = typeof r.maxAge === 'number' ? r.maxAge : 100;
    this.orderBy = r.orderBy ?? 'lastActive';
    this.orderDirection = r.orderDirection ?? 'desc';
    this.loadMembers();
  }

  onSortClick(field: 'created' | 'lastActive') {
    if (this.orderBy === field) {
      this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
      this.orderDirByField[field] = this.orderDirection;
    } else {
      this.orderBy = field;
      this.orderDirection = this.orderDirByField[field] ?? 'desc';
    }
    this.pageNumber = 1;
    this.loadMembers();
  }

  tooltipFor(field: 'created' | 'lastActive') {
    const dir = this.orderBy === field ? this.orderDirection : this.orderDirByField[field];
    return dir === 'asc' ? 'Ascendente' : 'Discendente';
  }

  refreshTooltip(tip: NgbTooltip) {
    // Close and reopen to force content refresh while hovered
    try {
      tip.close();
      setTimeout(() => tip.open(), 0);
    } catch { }
  }

  // Removed localStorage-based remember; the service now keeps params in memory
}

