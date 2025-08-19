import { Component, inject, OnInit } from '@angular/core';
import { Register } from "../register/register";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [Register],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  registerMode = false;
  http = inject(HttpClient); // invece di usare il costruttore per l'iniezione di dipendenze
  users: any;

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
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

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    console.log(this.registerMode); // per testare se il valore è corretto!!!
  }
}
