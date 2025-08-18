import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Nav } from './nav/nav'; // Assuming Nav component is in the same directory
import { AccountService } from './_services/account';
import { Home } from './home/home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Nav, Home],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('DatingApp');
  http = inject(HttpClient); // invece di usare il costruttore per l'iniezione di dipendenze
  private accountService = inject(AccountService);
  users: any;

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.accountService.currentUser.set(user);
    }
  }


  getUsers() {
    this.http.get("https://localhost:5001/api/users").subscribe({
      next: response => {
        this.users = response,
          console.log(this.users);
      },
      error: error => console.log(error),
      complete: () => console.log('Request completed')
    });
  }

}
