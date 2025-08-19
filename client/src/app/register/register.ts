import { Component, EventEmitter, input, Output } from '@angular/core';
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

  @Output() cancelRegister = new EventEmitter();

  register() {
    console.log(this.model)
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
