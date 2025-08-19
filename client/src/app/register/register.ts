import { Component, input } from '@angular/core';
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
  usersFromHome = input.required<any>();// ho usato un input signal al posto di @Input

  register() {
    console.log(this.model)
  }

  cancel() {
    console.log('cancelled')
  }
}
