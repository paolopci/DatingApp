import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../_models/User';
import { LoginCredentials } from './auth.models';

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Submitted': props<{ credentials: LoginCredentials }>(),
    'Login Succeeded': props<{ user: User }>(),
    'Login Failed': props<{ error: string }>(),
    'Logout Requested': emptyProps(),
    'Current User Restored': props<{ user: User }>(),
    'Current User Photo Updated': props<{ photoUrl: string }>()
  }
});
