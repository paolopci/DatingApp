import { Component } from '@angular/core';
import { Register } from "../register/register";
import { Toasts } from '../toasts/toasts';

@Component({
  selector: 'app-home',
  imports: [Register, Toasts],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  registerMode = false;




  registerToggle() {
    this.registerMode = !this.registerMode;
  }



  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
    console.log(this.registerMode); // per testare se il valore è corretto!!!
  }
}
