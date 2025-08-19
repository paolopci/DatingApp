import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account'; // Assuming Account service is in the same directory
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';


// Aggiorna il percorso se necessario

@Component({
  selector: 'app-nav',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  accountService = inject(AccountService)
  model: any = {};


  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  logout() {
    this.accountService.logout();
    console.log('Logged out');
  }

}
