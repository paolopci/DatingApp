import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/paginatedResult';
import { map } from 'rxjs';
import { LikesParams } from '../_models/likesParams';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  // Remembered Likes list params (in-memory + sessionStorage)
  private defaultParams(): LikesParams {
    return { predicate: 'liked', pageNumber: 1, pageSize: 5 };
  }
  private paramsSig = signal<LikesParams>(this.defaultParams());
  private hydrated = false;

  private storageKey() {
    // Read from localStorage to avoid circular dependency with AccountService
    try {
      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      const username = parsed?.username || 'anon';
      return `likesListParams:${username}`;
    } catch {
      return `likesListParams:anon`;
    }
  }

  private hydrateFromStorage() {
    if (this.hydrated) return;
    this.hydrated = true;
    try {
      const raw = sessionStorage.getItem(this.storageKey());
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        this.paramsSig.set({ ...this.defaultParams(), ...parsed });
      }
    } catch {}
  }

  getParams(): LikesParams {
    this.hydrateFromStorage();
    return this.paramsSig();
  }

  setParams(update: Partial<LikesParams>) {
    const prev = this.getParams();
    const next = { ...prev, ...update } as LikesParams;
    this.paramsSig.set(next);
    try { sessionStorage.setItem(this.storageKey(), JSON.stringify(next)); } catch {}
  }

  resetParams() {
    const next = this.defaultParams();
    this.paramsSig.set(next);
    try { sessionStorage.setItem(this.storageKey(), JSON.stringify(next)); } catch {}
  }


  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}likes/${targetId}`, {});
  }

  getLikes(predicate: string, pageNumber?: number, pageSize?: number) {
    const params: string[] = [`predicate=${encodeURIComponent(predicate)}`];
    if (pageNumber) params.push(`pageNumber=${pageNumber}`);
    if (pageSize) params.push(`pageSize=${pageSize}`);
    const url = `${this.baseUrl}likes${params.length ? '?' + params.join('&') : ''}`;

    return this.http.get<Member[]>(url, { observe: 'response' }).pipe(
      map(resp => {
        const items = resp.body ?? [];
        const paginationHeader = resp.headers.get('Pagination');
        const pagination = paginationHeader ? JSON.parse(paginationHeader) : undefined;
        this.paginatedResult.set({ items, pagination });
        return items;
      })
    );
  }

  getLikesIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next: ids => this.likeIds.set(ids)
    });
  }
}
