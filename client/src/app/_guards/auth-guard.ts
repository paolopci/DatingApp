import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account';
import { inject } from '@angular/core';
import { Toast } from '../_services/toast';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(Toast);

  if (accountService.currentUser()) {
    return true;
  } else {
    toastr.show('You shall not pass!', 'error');
    console.log('You shall not pass!');
    return false;
  }
};
