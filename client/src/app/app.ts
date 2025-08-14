import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('DatingApp');
  http = inject(HttpClient); // invece di usare il costruttore per l'iniezione di dipendenze
  users: any;

  ngOnInit(): void {
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
