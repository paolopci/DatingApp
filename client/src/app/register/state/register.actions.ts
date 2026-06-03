import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../_models/User';
import { RegisterRequest } from './register.models';

export const registerActions = createActionGroup({
  source: 'Register',
  events: {
    // Il componente segnala solo l'intenzione dell'utente; l'effetto gestisce HTTP e navigazione.
    'Register Submitted': props<{ request: RegisterRequest }>(),
    'Register Succeeded': props<{ user: User }>(),
    'Register Failed': props<{ validationErrors: string[] }>(),
    'Register Form Reset': emptyProps()
  }
});
