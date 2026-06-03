import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Toast } from '../../_services/toast';
import { catchError, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { authActions } from '../../auth/state/auth.actions';
import { MembersService } from '../../_services/members.service';
import { normalizeStoreError } from '../../likes/state/likes.effects';
import { membersActions } from './members.actions';
import { membersFeature } from './members.reducer';

@Injectable()
export class MembersEffects {
  private readonly actions$ = inject(Actions);
  private readonly membersService = inject(MembersService);
  private readonly store = inject(Store);
  private readonly toast = inject(Toast);

  loadMembers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        membersActions.loadMembers,
        membersActions.memberParamsChanged,
        membersActions.memberParamsReset
      ),
      withLatestFrom(this.store.select(membersFeature.selectParams)),
      switchMap(([, params]) =>
        this.membersService.getMembersFiltered(params).pipe(
          map(result => membersActions.membersLoaded({
            members: result.items,
            pagination: result.pagination
          })),
          catchError(error => of(membersActions.membersLoadFailed({ error: normalizeStoreError(error) })))
        )
      )
    );
  });

  loadMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(membersActions.loadMember),
      switchMap(({ username }) =>
        this.membersService.getMember(username).pipe(
          map(member => membersActions.memberLoaded({ member })),
          catchError(error => of(membersActions.membersLoadFailed({ error: normalizeStoreError(error) })))
        )
      )
    );
  });

  updateMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(membersActions.updateMemberRequested),
      switchMap(({ member }) =>
        this.membersService.updateMember(member).pipe(
          tap(() => this.toast.show('Profilo aggiornato con successo!', 'success')),
          map(() => membersActions.memberUpdated({ member })),
          catchError(error => of(membersActions.membersLoadFailed({ error: normalizeStoreError(error) })))
        )
      )
    );
  });

  setMainPhoto$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(membersActions.setMainPhotoRequested),
      switchMap(({ username, photoId, photoUrl }) =>
        this.membersService.setMainPhoto(photoId).pipe(
          mergeMap(() => [
            membersActions.mainPhotoUpdated({ username, photoId, photoUrl }),
            authActions.currentUserPhotoUpdated({ photoUrl })
          ]),
          catchError(error => of(membersActions.membersLoadFailed({ error: normalizeStoreError(error) })))
        )
      )
    );
  });

  deletePhoto$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(membersActions.deletePhotoRequested),
      switchMap(({ username, photoId }) =>
        this.membersService.deletePhoto(photoId).pipe(
          map(() => membersActions.photoDeleted({ username, photoId })),
          catchError(error => of(membersActions.membersLoadFailed({ error: normalizeStoreError(error) })))
        )
      )
    );
  });
}
