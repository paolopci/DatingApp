import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from './nav/nav'; // Assuming Nav component is in the same directory
import { AccountService } from './_services/account';

import { Toasts } from './toasts/toasts';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Nav, Toasts],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {


  private accountService = inject(AccountService);


  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');// prendo l'utente dal localStorage 
    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.currentUser.set(user);
    }
  }

}
