import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account'; // Assuming Account service is in the same directory
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Toast } from '../_services/toast';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


// Aggiorna il percorso se necessario

@Component({
  selector: 'app-nav',
  imports: [FormsModule, CommonModule, RouterLink, RouterLinkActive, TitleCasePipe, NgbDropdownModule],
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  accountService = inject(AccountService)
  private toastsService = inject(Toast);
  private router = inject(Router);
  model: any = {};



  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members'); // Navigate to members page after login
      },
      error: (err) => {
        // recupera il messaggio dall'errore
        let errorMessage = 'Errore imprevisto';

        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          } else if (err.error.title) {
            errorMessage = err.error.title;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.toastsService.show(errorMessage, 'error');
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/'); // Navigate to home page after logout
  }

}
