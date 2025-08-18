import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  registerMode = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }
}
