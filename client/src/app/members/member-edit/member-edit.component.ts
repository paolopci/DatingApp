import { Component, DestroyRef, OnInit, ViewChild, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Member } from '../../_models/member';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { authFeature } from '../../auth/state/auth.reducer';
import { membersActions } from '../state/members.actions';
import { membersFeature } from '../state/members.reducer';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, PhotoEditorComponent, NgbNavModule],
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  // hostListener serve per intercettare event che avvengono fuori dall'applicazione ad esempio nel browser
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private currentUser = this.store.selectSignal(authFeature.selectCurrentUser);

  // Sorgente: stato ufficiale (signal)
  member = signal<Member | null>(null);

  // Form model: oggetto mutabile per ngModel
  edit: Member | null = null;

  ngOnInit(): void {
    this.store.select(membersFeature.selectSelectedMember)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(member => {
        if (!member) return;
        this.member.set(member);
        this.edit = structuredClone(member);
      });

    const user = this.currentUser();
    if (user?.username) {
      this.loadMember(user.username);
    } else {
      console.warn('Nessun utente loggato');
    }
  }

  loadMember(username: string) {
    this.store.dispatch(membersActions.loadMember({ username }));
  }

  updateMember() {
    if (!this.edit) return;

    this.store.dispatch(membersActions.updateMemberRequested({ member: structuredClone(this.edit) }));
  }

  avatarUrl(): string {
    const m = this.edit ?? this.member();
    return m?.photoUrl || m?.photos?.find(p => p.isMain)?.url || 'assets/user.png';
  }
}
