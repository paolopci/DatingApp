import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_models/member';
import { map } from 'rxjs';
import { Paginator } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

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
        const pagination = paginationHeader ? JSON.parse(paginationHeader) as Paginator : undefined;
        return { items, pagination };
      })
    );
  }

  getLikesIds() {
    return this.http.get<number[]>(`${this.baseUrl}likes/list`);
  }
}
