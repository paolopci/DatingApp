import { Component, input, inject } from '@angular/core';
import { Member } from '../../_models/member';
import { Photo } from '../../_models/photo';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';
import { environment } from '../../../environments/environment.development';
import { DecimalPipe } from '@angular/common';



@Component({
  selector: 'app-photo-editor',
  imports: [NgxDropzoneModule, DecimalPipe],
  standalone: true,
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent {
  member = input.required<Member>();

  // true =upload multiplo, false=singolo
  allowMultiple = true;
  /** File scelti nel dropzone (solo anteprima locale) */
  files: File[] = [];

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // ad esempio https://localhost:5001/api/

  /* Selezione/drag&drop nel dropzone */
  onSelect(event: NgxDropzoneChangeEvent) {
    if (!event?.addedFiles?.length) return;

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

  /** TODO: implementazioni future */
  setMain(photo: Photo) {
    // chiamata API per impostare la foto principale (se/quando aggiungerai l'endpoint)
  }

  deletePhoto(photo: Photo) {
    // chiamata API DELETE e, se ok:
    // const current = this.member();
    // if (current) (current as any).photos = current.photos.filter(p => p.id !== photo.id);
  }
}
