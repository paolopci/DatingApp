import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account'; // Assuming Account service is in the same directory

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  private accountService = inject(AccountService)
  loggedIn = false;
  model: any = {};


  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.loggedIn = true;
      },
      error: error => console.log(error)
    });

  }

}
