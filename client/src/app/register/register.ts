import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account';
import { JsonPipe, CommonModule } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, CommonModule, TextInputComponent],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  model: any = {};
  registerForm: FormGroup = new FormGroup({});
  cancelRegister = output<boolean>();


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
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
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
    }

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
