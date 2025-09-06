import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { map, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);


  getMembers() {
    if (this.members().length > 0) return of(this.members());

    return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
      tap(members => this.members.set(members))
    );
  }

  getMember(username: string) {
    const member = this.members().find(x => x.username === username);
    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        this.members.update(members => members.map(m => m.username === member.username ? member : m))
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});

  }

  // Cancella una foto lato server
  deletePhoto(photoId: number) {
    // API: DELETE /api/users/delete-photo/{photoId}
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  // Aggiorna la cache locale quando cambia la main photo
  syncMainPhotoLocal(username: string, photoId: number, photoUrl: string) {
    this.members.update(list => list.map(m => {
      if (m.username !== username) return m;
      const updatedPhotos = (m.photos || []).map(p => ({ ...p, isMain: p.id === photoId }));
      return { ...m, photoUrl: photoUrl, photos: updatedPhotos } as Member;
    }));
  }
}
