import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Toast } from '../_services/toast';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth/state/auth.reducer';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const toastr = inject(Toast);
  const isAuthenticated = store.selectSignal(authFeature.selectIsAuthenticated);

  if (isAuthenticated()) {
    return true;
  } else {
    toastr.show('You shall not pass!', 'error');
    console.log('You shall not pass!');
    return false;
  }
};
