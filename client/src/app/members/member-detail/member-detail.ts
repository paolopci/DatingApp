import { Component, computed, inject, input, OnInit, signal, effect } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { Photo } from '../../_models/photo';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-member-detail',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.css'
})
export class MemberDetail implements OnInit {

  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  //member?: Member
  member = input<any | null>(null);

  /** Array di immagini sempre definito (anche se l'input è null/undefined). */
  images = computed<Photo[]>(() => this.vm()?.photos ?? []);
  /** True se ci sono immagini. Utile se vuoi usarlo nel template. */
  hasImages = computed(() => this.images().length > 0);
  /** True se ci sono almeno 2 immagini → mostrare i controlli prev/next. */
  canSlide = computed(() => this.images().length > 1);

  /** Avatar principale con fallback al placeholder. */
  avatarUrl = computed(() => this.vm()?.photoUrl || 'assets/user.png');

  // 2) Aggiungi un signal scrivibile per lo stato locale
  private memberState = signal<Member | null>(null);

  // 3) Sincronizza automaticamente l'input nel signal locale (se il parent lo fornisce)
  private syncInput = effect(() => {
    const fromParent = this.member();
    if (fromParent) this.memberState.set(fromParent);
  });



  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: m => {
        this.memberState.set(m)
        console.log(m);
      }
    });
  }

  // Computed che trasforma le foto in immagini per la gallery


  // Facoltativo: getter comodo per il template
  vm = computed(() => this.memberState());
}
