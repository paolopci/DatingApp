import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LikesService } from '../_services/likes.service';
import { Member } from '../_models/member';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lists',
  imports: [MemberCardComponent, FormsModule, NgbButtonsModule],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {
  private likesService = inject(LikesService);
  members: Member[] = [];
  predicate = 'liked';


  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: members => (this.members = members)
    });
  }

  getTitle() {
    switch (this.predicate) {
      case 'liked': return 'Members you like';
      case 'likedBy': return 'Members who like you';
      default: return 'Mutual';
    }
  }

}
