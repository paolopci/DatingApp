import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  model: any = {};

  register() {
    console.log(this.model)
  }

  cancel() {
    console.log('cancelled')
  }
}
