import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Member } from '../../_models/member';
import { Paginator } from '../../_models/pagination';
import { Photo } from '../../_models/photo';
import { UserParams } from '../../_models/userParams';

export const membersActions = createActionGroup({
  source: 'Members',
  events: {
    'Load Members': emptyProps(),
    'Members Loaded': props<{ members: Member[]; pagination: Paginator | undefined }>(),
    'Members Load Failed': props<{ error: string }>(),
    'Member Params Changed': props<{ params: Partial<UserParams> }>(),
    'Member Params Reset': props<{ gender: string | undefined }>(),
    'Load Member': props<{ username: string }>(),
    'Member Loaded': props<{ member: Member }>(),
    'Update Member Requested': props<{ member: Member }>(),
    'Member Updated': props<{ member: Member }>(),
    'Set Main Photo Requested': props<{ username: string; photoId: number; photoUrl: string }>(),
    'Main Photo Updated': props<{ username: string; photoId: number; photoUrl: string }>(),
    'Photo Added': props<{ username: string; photo: Photo }>(),
    'Delete Photo Requested': props<{ username: string; photoId: number }>(),
    'Photo Deleted': props<{ username: string; photoId: number }>()
  }
});
