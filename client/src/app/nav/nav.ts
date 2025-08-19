import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account'; // Assuming Account service is in the same directory
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


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
  private router = inject(Router);
  model: any = {};


  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members'); // Navigate to members page after login
      },
      error: error => {
        console.log(error);
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/'); // Navigate to home page after logout
  }

}
