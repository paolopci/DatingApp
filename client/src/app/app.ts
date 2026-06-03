import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Spinner } from './spinner/spinner'; // Importa il componente spinner.
import { Nav } from './nav/nav';
import { AccountService } from './_services/account';
import { Toasts } from './toasts/toasts';
import { Store } from '@ngrx/store';
import { authActions } from './auth/state/auth.actions';

/**
 * The root component of the application.
 * It serves as the main container for all other components.
 */
@Component({
  selector: 'app-root',
  // Qui vengono importati i moduli e i componenti standalone necessari per il template.
  imports: [
    RouterOutlet,   // Necessario per il routing di Angular.
    CommonModule,   // Fornisce direttive comuni come *ngIf, *ngFor, etc.
    Nav,            // Il componente della barra di navigazione.
    Toasts,         // Il componente per visualizzare le notifiche toast.
    Spinner         // Il componente per lo spinner di caricamento globale.
  ],
  standalone: true, // Questo componente è "standalone", non legato a un NgModule.
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private accountService = inject(AccountService);
  private store = inject(Store);

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties.
   * We use it to load the current user from local storage.
   */
  ngOnInit(): void {
    this.setCurrentUser();
  }

  /**
   * Checks for a user object in local storage and, if found,
   * restores the current user into the NgRx auth store.
   * Questo assicura che lo stato di login dell'utente persista tra le sessioni.
   */
  setCurrentUser() {
    const userString = localStorage.getItem('user'); // Recupera l'utente dal localStorage.
    if (userString) {
      const user = this.accountService.getPersistedCurrentUser();
      if (user) {
        this.store.dispatch(authActions.currentUserRestored({ user }));
      }
    }
  }
}
