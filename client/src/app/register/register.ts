import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { LocalizedNgbDateParserFormatter } from './localized-ngb-date-parser-formatter';
import { AccountService } from '../_services/account';
import { JsonPipe, CommonModule } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, CommonModule, TextInputComponent, NgbDatepickerModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [
    { provide: NgbDateParserFormatter, useClass: LocalizedNgbDateParserFormatter }
  ]
})
export class Register implements OnInit {

  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  model: any = {};
  registerForm: FormGroup = new FormGroup({});
  cancelRegister = output<boolean>();

  // Datepicker bounds
  minDob: NgbDateStruct = { year: 1900, month: 1, day: 1 };
  maxDob: NgbDateStruct = (() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() + 1, day: t.getDate() };
  })();


  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ["", Validators.required],
      knownAs: ["", Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ["", Validators.required],
      country: ["", Validators.required],
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
