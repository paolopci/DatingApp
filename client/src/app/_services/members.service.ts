import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { map, of, tap } from 'rxjs';
import { PaginatedResult } from '../_models/paginatedResult';
import { UserParams } from '../_models/userParams';
import { Paginator } from '../_models/pagination';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  members = signal<Member[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  // List cache (LRU + TTL)
  private readonly LIST_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
  private readonly LIST_CACHE_MAX = 40; // max keys
  private listCache = new Map<string, { items: Member[]; pagination?: Paginator; ts: number }>();

  private buildListKey(params?: Partial<UserParams>): string {
    if (!params) return '__all__';
    const parts = [
      `p=${params.pageNumber ?? ''}`,
      `s=${params.pageSize ?? ''}`,
      `g=${(params.gender ?? '').toString().toLowerCase()}`,
      `min=${params.minAge ?? ''}`,
      `max=${params.maxAge ?? ''}`,
      `ob=${params.orderBy ?? ''}`,
      `od=${params.orderDirection ?? ''}`
    ];
    return parts.join('&');
  }

  private getFromListCache(key: string) {
    const hit = this.listCache.get(key);
    if (!hit) return undefined;
    const fresh = Date.now() - hit.ts < this.LIST_CACHE_TTL_MS;
    if (!fresh) { this.listCache.delete(key); return undefined; }
    // refresh LRU
    this.listCache.delete(key);
    this.listCache.set(key, hit);
    return hit;
  }

  private putInListCache(key: string, value: { items: Member[]; pagination?: Paginator }) {
    while (this.listCache.size >= this.LIST_CACHE_MAX) {
      const oldest = this.listCache.keys().next().value as string | undefined;
      if (oldest === undefined) break;
      this.listCache.delete(oldest);
    }
    this.listCache.set(key, { ...value, ts: Date.now() });
  }

  private invalidateListCache() { this.listCache.clear(); }

  // ===== Member detail cache (TTL) =====
  private readonly MEMBER_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes
  private memberCache = new Map<string, { data: Member; ts: number }>();

  private getFromMemberCache(username: string): Member | undefined {
    const hit = this.memberCache.get(username);
    if (!hit) return undefined;
    const fresh = Date.now() - hit.ts < this.MEMBER_CACHE_TTL_MS;
    if (!fresh) { this.memberCache.delete(username); return undefined; }
    return hit.data;
  }

  private putInMemberCache(member: Member) {
    if (!member?.username) return;
    this.memberCache.set(member.username, { data: member, ts: Date.now() });
  }

  
  getMembers(pageNumber?: number, pageSize?: number) {
    // Se è richiesta paginazione, esegue la chiamata con observe:'response' per leggere gli header
    if (pageNumber && pageSize) {
      const params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());

      const cacheKey = this.buildListKey({ pageNumber, pageSize });
      const cached = this.getFromListCache(cacheKey);
      if (cached) {
        this.members.set(cached.items);
        this.paginatedResult.set({ items: cached.items, pagination: cached.pagination });
        return of(cached.items);
      }

      return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
        .pipe(
          map(resp => {
            const items = resp.body ?? [];
            const paginationHeader = resp.headers.get('Pagination');
            const pagination = paginationHeader ? JSON.parse(paginationHeader) : undefined;

            this.members.set(items);
            this.paginatedResult.set({ items, pagination });
            this.putInListCache(cacheKey, { items, pagination });
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
    // 1) tenta da lista già caricata
    const fromList = this.members().find(x => x.username === username);
    if (fromList) { this.putInMemberCache(fromList); return of(fromList); }

    // 2) tenta dal cache dettaglio
    const cached = this.getFromMemberCache(username);
    if (cached) return of(cached);

    // 3) fallback API e memorizzazione
    return this.http.get<Member>(this.baseUrl + 'users/' + username).pipe(
      tap(m => this.putInMemberCache(m))
    );
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        this.members.update(members => members.map(m => m.username === member.username ? member : m))
        this.putInMemberCache(member); // write-through per dettaglio
        this.invalidateListCache();
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {}).pipe(
      tap(() => this.invalidateListCache())
    );

  }

  // Cancella una foto lato server
  deletePhoto(photoId: number) {
    // API: DELETE /api/users/delete-photo/{photoId}
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId).pipe(
      tap(() => this.invalidateListCache())
    );
  }

  // Aggiorna la cache locale quando cambia la main photo
  syncMainPhotoLocal(username: string, photoId: number, photoUrl: string) {
    this.members.update(list => list.map(m => {
      if (m.username !== username) return m;
      const updatedPhotos = (m.photos || []).map(p => ({ ...p, isMain: p.id === photoId }));
      return { ...m, photoUrl: photoUrl, photos: updatedPhotos } as Member;
    }));

    // Aggiorna eventuale cache dettaglio
    const cached = this.getFromMemberCache(username);
    if (cached) {
      const updatedPhotos = (cached.photos || []).map(p => ({ ...p, isMain: p.id === photoId }));
      const updated: Member = { ...cached, photoUrl, photos: updatedPhotos } as Member;
      this.putInMemberCache(updated);
    }
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

    const cacheKey = this.buildListKey(paramsIn);
    const cached = this.getFromListCache(cacheKey);
    if (cached) {
      this.members.set(cached.items);
      this.paginatedResult.set({ items: cached.items, pagination: cached.pagination });
      return of(cached.items);
    }

    return this.http.get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map(resp => {
          const items = resp.body ?? [];
          const paginationHeader = resp.headers.get('Pagination');
          const pagination = paginationHeader ? JSON.parse(paginationHeader) : undefined;

          this.members.set(items);
          this.paginatedResult.set({ items, pagination });
          this.putInListCache(cacheKey, { items, pagination });
          return items;
        })
      );
  }
}
