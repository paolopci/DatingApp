import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LikesService } from '../_services/likes.service';
import { Member } from '../_models/member';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Paginator } from '../_models/pagination';
import { LikesPredicate } from '../_models/likesParams';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MemberCardComponent, FormsModule, NgbPaginationModule],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  members: Member[] = [];
  predicate: LikesPredicate = 'liked';
  pageNumber = 1;
  pageSize = 5;
  pagination?: Paginator;


  ngOnInit(): void {
    // Initialize from service remembered params
    const p = this.likesService.getParams();
    this.predicate = p.predicate;
    this.pageNumber = p.pageNumber;
    this.pageSize = p.pageSize;
    this.loadLikes();
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: members => {
        this.members = members;
        const pr = this.likesService.paginatedResult();
        this.pagination = pr?.pagination ?? undefined;
      }
    });
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
    this.likesService.setParams({ predicate: this.predicate, pageNumber: this.pageNumber, pageSize: this.pageSize });
    this.loadLikes();
  }

  pageChanged(page: number) {
    if (this.pageNumber === page) return;
    const last = this.pagination?.totalPages ?? 1;
    this.pageNumber = Math.min(Math.max(page, 1), last);
    this.likesService.setParams({ pageNumber: this.pageNumber });
    this.loadLikes();
  }

  onPageSizeChange(value: string | number) {
    const newSize = Number(value);
    if (!Number.isFinite(newSize) || newSize <= 0) return;
    if (this.pageSize === newSize) return;
    this.pageSize = newSize;
    this.pageNumber = 1;
    this.likesService.setParams({ pageSize: this.pageSize, pageNumber: this.pageNumber });
    this.loadLikes();
  }

}
