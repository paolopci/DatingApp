import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LikesPredicate } from '../../_models/likesParams';
import { Member } from '../../_models/member';
import { Paginator } from '../../_models/pagination';

export const likesActions = createActionGroup({
  source: 'Likes',
  events: {
    'Load Like Ids': emptyProps(),
    'Like Ids Loaded': props<{ ids: number[] }>(),
    'Load Likes': emptyProps(),
    'Likes Loaded': props<{ members: Member[]; pagination: Paginator | undefined }>(),
    'Likes Load Failed': props<{ error: string }>(),
    'Likes Predicate Changed': props<{ predicate: LikesPredicate }>(),
    'Likes Page Changed': props<{ pageNumber: number }>(),
    'Likes Page Size Changed': props<{ pageSize: number }>(),
    'Like Toggled': props<{ memberId: number }>(),
    'Like Toggle Failed': props<{ memberId: number; error: string }>()
  }
});
