import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { likesActions } from '../../likes/state/likes.actions';
import { likesFeature } from '../../likes/state/likes.reducer';


@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  private store = inject(Store);
  private likeIds = this.store.selectSignal(likesFeature.selectLikeIds);
  member = input.required<Member>();

  hasLaked = computed(() => this.likeIds().includes(this.member().id));

  toggleLike() {
    this.store.dispatch(likesActions.likeToggled({ memberId: this.member().id }));
  }

}
