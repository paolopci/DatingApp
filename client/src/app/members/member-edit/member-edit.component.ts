import { Component, OnInit, inject, signal, computed, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account';
import { Toast } from '../../_services/toast';
import { Member } from '../../_models/member';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

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

  private memberService = inject(MembersService);
  private toast = inject(Toast);
  private accountService = inject(AccountService);

  // Sorgente: stato ufficiale (signal)
  member = signal<Member | null>(null);

  // Form model: oggetto mutabile per ngModel
  edit: Member | null = null;

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
      next: m => {
        this.member.set(m);
        this.edit = m;
      },
      error: err => console.error('Errore nel caricamento del profilo:', err)
    });
  }

  updateMember() {
    if (!this.edit) return;

    this.memberService.updateMember(this.edit).subscribe({
      next: () => {
        // allinea lo stato locale (signal) alla versione appena salvata

        this.member.set(structuredClone(this.edit!));
        // usa lo stesso metodo che stavi già usando
        this.toast.show('Profilo aggiornato con successo!', 'success');
        this.member.set(structuredClone(this.edit!));
        this.editForm?.reset(this.edit);
      },
      error: (err: unknown) => {
        console.error(err);
        this.toast.show('Aggiornamento non riuscito');
      }
    });
  }

  avatarUrl(): string {
    const m = this.edit ?? this.member();
    return m?.photoUrl || m?.photos?.find(p => p.isMain)?.url || 'assets/user.png';
  }
}
