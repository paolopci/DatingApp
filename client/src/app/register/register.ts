import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account';


@Component({
  selector: 'app-register',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {


  private accountService = inject(AccountService);
  model: any = {};
  //usersFromHome = input.required<any>();// ho usato un input signal al posto di @Input

  cancelRegister = output<boolean>();

  register() {
    this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => {
        console.log(error);
      }
    });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
