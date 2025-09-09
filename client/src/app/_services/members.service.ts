import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { map, of, tap } from 'rxjs';
import { PaginatedResult } from '../_models/paginatedResult';
import { UserParams } from '../_models/userParams';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);


  getMembers(pageNumber?: number, pageSize?: number) {
    // Se è richiesta paginazione, esegue la chiamata con observe:'response' per leggere gli header
    if (pageNumber && pageSize) {
      const params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());

      return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
        .pipe(
          map(resp => {
            const items = resp.body ?? [];
            const paginationHeader = resp.headers.get('Pagination');
            const pagination = paginationHeader ? JSON.parse(paginationHeader) : undefined;

            this.members.set(items);
            this.paginatedResult.set({ items, pagination });
            return items;
          })
        );
    }

    // Senza paginazione: usa la cache se presente, altrimenti chiama l'API semplice
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

  // Versione con filtri e paginazione
  getMembersFiltered(paramsIn: UserParams) {
    let params = new HttpParams()
      .set('pageNumber', paramsIn.pageNumber.toString())
      .set('pageSize', paramsIn.pageSize.toString());

    if (paramsIn.gender) params = params.set('gender', paramsIn.gender.toLowerCase());
    if (typeof paramsIn.minAge === 'number') params = params.set('minAge', String(paramsIn.minAge));
    if (typeof paramsIn.maxAge === 'number') params = params.set('maxAge', String(paramsIn.maxAge));
    if (paramsIn.orderBy) params = params.set('orderBy', paramsIn.orderBy);
    if (paramsIn.orderDirection) {
      params = params.set('orderDirection', paramsIn.orderDirection);
    }

    return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map(resp => {
          const items = resp.body ?? [];
          const paginationHeader = resp.headers.get('Pagination');
          const pagination = paginationHeader ? JSON.parse(paginationHeader) : undefined;

          this.members.set(items);
          this.paginatedResult.set({ items, pagination });
          return items;
        })
      );
  }
}
