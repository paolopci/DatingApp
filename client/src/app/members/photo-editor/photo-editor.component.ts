import { Component, input, inject, signal } from '@angular/core';
import { Member } from '../../_models/member';
import { Photo } from '../../_models/photo';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { environment } from '../../../environments/environment.development';
import { DecimalPipe, CommonModule, NgFor } from '@angular/common';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account';
import { Toast } from '../../_services/toast';
import { finalize } from 'rxjs';



@Component({
  selector: 'app-photo-editor',
  imports: [NgxDropzoneModule, DecimalPipe, CommonModule, NgFor],
  standalone: true,
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent {
  member = input.required<Member>();
  private memberService = inject(MembersService);
  private accountService = inject(AccountService);
  private readonly toastr = inject(Toast);


  // Stato UI per disabilitare i pulsanti mentre chiamiamo l'API
  private readonly _isSettingMain = signal(false);
  isSettingMain = this._isSettingMain.asReadonly();

  // Traccia gli ID delle foto in cancellazione per disabilitare i bottoni
  private readonly _deleting = signal<Set<number>>(new Set());
  // Funzione helper per il template: indica se una foto è in cancellazione
  isDeleting = (id: number) => this._deleting().has(id);





  // true =upload multiplo, false=singolo
  allowMultiple = true;
  /** File scelti nel dropzone (solo anteprima locale) */
  files: File[] = [];

  /** Messaggi di validazione */
  validationError: string | null = null;
  /** Limiti dimensionali */
  private static readonly MAX_BYTES = 10 * 1024 * 1024; // 10 MB


  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // ad esempio https://localhost:5001/api/

  /* Selezione/drag&drop nel dropzone */
  onSelect(event: NgxDropzoneChangeEvent) {
    this.validationError = null;

    if (!event?.addedFiles?.length) return;

    const batchSize = event.addedFiles.reduce((acc, f) => acc + f.size, 0);
    if (batchSize > PhotoEditorComponent.MAX_BYTES) {
      this.validationError =
        `Dimensione totale selezionata ${(batchSize / 1024 / 1024).toFixed(2)} MB supera il limite di ${PhotoEditorComponent.MAX_BYTES / 1024} ` +
        `Seleziona meno file o più piccoli.`;
      return; // blocco l'upload
    }

    // 2) controllo per singolo file
    const tooBig = event.addedFiles.find(f => f.size > PhotoEditorComponent.MAX_BYTES);
    if (tooBig) {
      this.validationError =
        `Il file "${tooBig.name}" è ${(tooBig.size / 1024 / 1024).toFixed(2)} MB ` +
        `e supera il limite di 10 MB.`;
      return; // blocco l’upload
    }

    // Se tutto ok → accodo e carico immediatamente ciascun file
    for (const file of event.addedFiles) {
      this.files.push(file);
      this.uploadPhoto(file);
    }
  }

  /** Rimozione dal dropzone (locale, non Cloudinary) */
  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file)
  }

  /** Upload immediato -> /api/users/add-photo e aggiornamento galleria */
  private uploadPhoto(file: File) {
    const form = new FormData();
    form.append('file', file);

    this.http.post<Photo>(`${this.baseUrl}users/add-photo`, form, {
      observe: 'events',
      reportProgress: true
    })
      .subscribe({
        next: (evt: HttpEvent<Photo>) => {
          if (evt.type === HttpEventType.Response && evt.body) {
            const added = evt.body; // PhotoDto

            // input() è readonly: non posso riassegnare il Member.
            // Cambio la reference dell'array photos per triggerare la view.
            const current = this.member();
            if (!current) return;

            (current as any).photos = [...(current.photos ?? []), added];
          }
        },
        error: (err) => {
          console.error('Errore upload', err);
        }
      });
  }

  /**
  * Imposta la foto come principale (main) lato server
  * e allinea immediatamente lo stato locale + navbar.
  */
  setMainPhoto(photo: Photo) {
    if (!photo || !photo.id) return;
    // Evita round-trip inutili
    if (photo.isMain) return;

    this._isSettingMain.set(true);


    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        // 1 aggiorna le foto del member (clear main precedente, set nuova main)
        const m = this.member();// InputSignal<Member> nel tuo template usi member().photos 
        if (!m) return;
        for (const p of m.photos) {
          if (p.isMain) p.isMain = false;
        }
        const target = m.photos.find(p => p.id === photo.id);
        if (target) target.isMain = true;
        // Aggiorna anche l'avatar del profilo mostrato nelle viste che leggono photoUrl
        // (es. Your profile nella Member Edit)
        (m as any).photoUrl = photo.url;

        // Allinea anche la cache della lista membri (card ecc.)
        this.memberService.syncMainPhotoLocal(m.username, photo.id!, photo.url);
        // 2) Aggiorna la navbar (currentUser.photoUrl) senza richiedere un nuovo login
        this.accountService.currentUser.update(u => {
          if (!u) return u;
          return {
            ...u,
            photoUrl: photo.url
          }
        });
        // (opzionale) toast/success log
        this.toastr.show('Main photo aggiornata');
      },
      error: (err) => {
        console.error('Errore nel setMainPhoto', err);
        this.toastr.show('Impossibile impostare la main photo');
      }, complete: () => {
        this._isSettingMain.set(false);
      }
    });
  }

  deletePhoto(photo: Photo) {
    // Non è consentito eliminare la foto principale
    if (!photo || !photo.id) return;
    if (photo.isMain) {
      this.toastr.show('Non puoi eliminare la foto principale', 'error');
      return;
    }

    // Chiamo l'endpoint back-end per eliminare la foto.
    // API: DELETE /api/users/delete-photo/{photoId}
    // Segna la foto come "in cancellazione" per evitare doppi click
    this._deleting.update(s => new Set([...s, photo.id!]));

    this.memberService.deletePhoto(photo.id).pipe(
      // Al termine (successo/errore) rimuove lo stato di busy per questo ID
      finalize(() => this._deleting.update(s => { const n = new Set(s); n.delete(photo.id!); return n; }))
    ).subscribe({
      next: () => {
        // Aggiorna lo stato locale rimuovendo la foto dalla galleria
        const current = this.member();
        if (!current) return;
        (current as any).photos = current.photos.filter(p => p.id !== photo.id);

        this.toastr.show('Foto eliminata', 'success');
      },
      error: (err) => {
        console.error('Errore eliminazione foto', err);
        this.toastr.show('Impossibile eliminare la foto', 'error');
      }
    });
  }
}
