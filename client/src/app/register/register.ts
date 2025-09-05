import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account';
import { JsonPipe } from '@angular/common';



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  private accountService = inject(AccountService);
  model: any = {};
  registerForm: FormGroup = new FormGroup({});
  cancelRegister = output<boolean>();

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl("Ciao", Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
    });
    this.registerForm.get('password')!.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')!.updateValueAndValidity({ onlySelf: true });
    });
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true };
    }
  }

  register() {

    console.log(this.registerForm.value);

    // this.accountService.register(this.model).subscribe({
    //   next: response => {
    //     console.log(response);
    //     this.cancel();
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
