import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account';
import { Toast } from '../../_services/toast';
import { Member } from '../../_models/member';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {

  member = signal<Member | null>(null);

  private memberService = inject(MembersService);
  private accountService = inject(AccountService);
  private toastService = inject(Toast);

  avatarUrl = computed(() => this.member()?.photoUrl || 'assets/user.png');

  ngOnInit(): void {
    const user = this.accountService.currentUser(); // ✅ accesso diretto alla signal
    if (user?.username) {
      this.loadMember(user.username);
    } else {
      console.warn('Nessun utente loggato');
    }
  }

  loadMember(username: string) {
    this.memberService.getMember(username).subscribe({
      next: m => this.member.set(m),
      error: err => console.error('Errore nel caricamento del profilo:', err)
    });
  }

  updateMember() {
    const updated = this.member();
    if (!updated) return;

    this.memberService.updateMember(updated).subscribe({
      next: () => this.toastService.show('Profilo aggiornato con successo ✅'),
      error: () => this.toastService.show('Errore durante l\'aggiornamento ❌')
    });
  }
}
