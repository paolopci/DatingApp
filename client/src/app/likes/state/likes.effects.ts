import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { LikesService } from '../../_services/likes.service';
import { likesActions } from './likes.actions';
import { likesFeature } from './likes.reducer';

@Injectable()
export class LikesEffects {
  private readonly actions$ = inject(Actions);
  private readonly likesService = inject(LikesService);
  private readonly store = inject(Store);

  loadLikeIds$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(likesActions.loadLikeIds),
      switchMap(() =>
        this.likesService.getLikesIds().pipe(
          map(ids => likesActions.likeIdsLoaded({ ids })),
          catchError(error => of(likesActions.likesLoadFailed({ error: normalizeStoreError(error) })))
        )
      )
    );
  });

  loadLikes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        likesActions.loadLikes,
        likesActions.likesPredicateChanged,
        likesActions.likesPageChanged,
        likesActions.likesPageSizeChanged
      ),
      withLatestFrom(this.store.select(likesFeature.selectParams)),
      switchMap(([, params]) =>
        this.likesService.getLikes(params.predicate, params.pageNumber, params.pageSize).pipe(
          map(result => likesActions.likesLoaded({
            members: result.items,
            pagination: result.pagination
          })),
          catchError(error => of(likesActions.likesLoadFailed({ error: normalizeStoreError(error) })))
        )
      )
    );
  });

  toggleLike$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(likesActions.likeToggled),
      switchMap(({ memberId }) =>
        this.likesService.toggleLike(memberId).pipe(
          map(() => likesActions.loadLikes()),
          catchError(error => of(likesActions.likeToggleFailed({
            memberId,
            error: normalizeStoreError(error)
          })))
        )
      )
    );
  });
}

export function normalizeStoreError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return 'Errore imprevisto.';
}
