import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { authActions } from '../auth/state/auth.actions';
import { LoginCredentials } from '../auth/state/auth.models';
import { authFeature } from '../auth/state/auth.reducer';


// Aggiorna il percorso se necessario

@Component({
  selector: 'app-nav',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive, TitleCasePipe, NgbDropdownModule],
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  private readonly store = inject(Store);
  currentUser$ = this.store.select(authFeature.selectCurrentUser);
  loginError$ = this.store.select(authFeature.selectError);
  loading$ = this.store.select(authFeature.selectLoading);
  model: LoginCredentials = { username: '', password: '' };



  login() {
    this.store.dispatch(authActions.loginSubmitted({ credentials: this.model }));
  }

  logout() {
    this.store.dispatch(authActions.logoutRequested());
  }

}
