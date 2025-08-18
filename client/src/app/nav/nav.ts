import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  model: any = {};


  login() { }

}
