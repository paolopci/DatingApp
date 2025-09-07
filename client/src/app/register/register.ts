import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DdmmyyyyNgbDateParserFormatter, DDMYYYY_REGEX } from './ddmmyyyy-ngb-date-parser-formatter';
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
    // Enforce strict dd/MM/yyyy parsing/formatting for ng-bootstrap datepicker
    { provide: NgbDateParserFormatter, useClass: DdmmyyyyNgbDateParserFormatter }
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

  // Track raw input text to validate exact dd/MM/yyyy pattern
  private rawDob: string = '';
  dobFormatInvalid = false;


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

    // When a date is picked from popup, ensure formatted string is valid and clear format error
    this.registerForm.get('dateOfBirth')!.valueChanges.subscribe(val => {
      if (val && typeof val === 'object') {
        // Value is NgbDateStruct; formatter takes care of display, our pattern is always satisfied
        this.dobFormatInvalid = false;
      }
    });
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true };
    }
  }

  register() {
    if (this.registerForm.invalid || this.dobFormatInvalid) {
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

  // Helpers for DOB field
  get dobCtrl(): AbstractControl | null { return this.registerForm.get('dateOfBirth'); }

  onDobInput(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.rawDob = input.value ?? '';
    this.dobFormatInvalid = this.rawDob.length > 0 && !this.isValidDdMmYyyy(this.rawDob);

    const ctrl = this.dobCtrl;
    if (ctrl) {
      const current = ctrl.errors || {};
      if (this.dobFormatInvalid) {
        ctrl.setErrors({ ...current, dateFormat: true });
      } else if ('dateFormat' in current) {
        const { dateFormat, ...rest } = current as any;
        ctrl.setErrors(Object.keys(rest).length ? rest : null);
      }
    }
  }

  private isValidDdMmYyyy(v: string): boolean {
    const m = v.match(DDMYYYY_REGEX);
    if (!m) return false;
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10);
    const year = parseInt(m[3], 10);
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
  }
}
