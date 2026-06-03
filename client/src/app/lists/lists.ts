import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LikesPredicate } from '../_models/likesParams';
import { Store } from '@ngrx/store';
import { likesActions } from '../likes/state/likes.actions';
import { likesFeature } from '../likes/state/likes.reducer';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MemberCardComponent, FormsModule, NgbPaginationModule, AsyncPipe],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  private store = inject(Store);
  members$ = this.store.select(likesFeature.selectMembers);
  pagination$ = this.store.select(likesFeature.selectPagination);
  private params = this.store.selectSignal(likesFeature.selectParams);

  predicate: LikesPredicate = 'liked';
  pageNumber = 1;
  pageSize = 5;


  ngOnInit(): void {
    const p = this.params();
    this.predicate = p.predicate;
    this.pageNumber = p.pageNumber;
    this.pageSize = p.pageSize;
    this.store.dispatch(likesActions.loadLikes());
  }

  loadLikes() {
    this.store.dispatch(likesActions.loadLikes());
  }

  getTitle() {
    switch (this.predicate) {
      case 'liked': return 'Members you like';
      case 'likedBy': return 'Members who like you';
      default: return 'Mutual';
    }
  }

  setPredicate(value: 'liked' | 'likedBy' | 'mutual') {
    if (this.predicate === value) return;
    this.predicate = value;
    this.pageNumber = 1;
    this.store.dispatch(likesActions.likesPredicateChanged({ predicate: this.predicate }));
  }

  pageChanged(page: number) {
    if (this.pageNumber === page) return;
    const last = this.store.selectSignal(likesFeature.selectPagination)()?.totalPages ?? 1;
    this.pageNumber = Math.min(Math.max(page, 1), last);
    this.store.dispatch(likesActions.likesPageChanged({ pageNumber: this.pageNumber }));
  }

  onPageSizeChange(value: string | number) {
    const newSize = Number(value);
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    if (this.pageSize === newSize) return;
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.store.dispatch(likesActions.likesPageSizeChanged({ pageSize: this.pageSize }));
  }

}
