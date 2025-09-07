import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DdmmyyyyNgbDateParserFormatter, DDMYYYY_REGEX } from './ddmmyyyy-ngb-date-parser-formatter';
import { AccountService } from '../_services/account';
import { JsonPipe, CommonModule } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { Toast } from '../_services/toast';
import { Router } from '@angular/router';

/*
  Componente Register (standalone)
  - Usa Reactive Forms per gestire lo stato e la validazione.
  - Integra ng-bootstrap Datepicker con un parser/formatter personalizzato
    che accetta e mostra SOLO il formato dd/MM/yyyy con zeri iniziali.
  - Mostra un messaggio di errore se il formato digitato non è valido
    e impedisce l'invio del form finché la data non rispetta il formato.
*/



@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, CommonModule, TextInputComponent, NgbDatepickerModule],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
  providers: [
    // Sostituisce il parser/formatter di ng-bootstrap con uno che forza
    // rigorosamente il formato dd/MM/yyyy (con zeri) in input e output.
    { provide: NgbDateParserFormatter, useClass: DdmmyyyyNgbDateParserFormatter }
  ]
})
export class Register implements OnInit {

  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private readonly toastr = inject(Toast);
  private router = inject(Router);
  model: any = {};
  registerForm: FormGroup = new FormGroup({});
  cancelRegister = output<boolean>();
  validationErrors: string[] | undefined;

  // Limiti del datepicker (data minima e massima ammessa)
  minDob: NgbDateStruct = { year: 1900, month: 1, day: 1 };
  maxDob: NgbDateStruct = (() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() + 1, day: t.getDate() };
  })();

  // Traccia il testo digitato per validarlo con regex dd/MM/yyyy
  private rawDob: string = '';
  dobFormatInvalid = false;


  ngOnInit(): void {
    this.initializeForm();
  }

  // Crea il Reactive Form e registra i listener di validazione
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
    // Se cambia la password, rivalida il campo di conferma
    this.registerForm.get('password')!.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')!.updateValueAndValidity({ onlySelf: true });
    });

    // Se la data viene scelta dal popup (valida), rimuovi l'errore di formato manuale
    this.registerForm.get('dateOfBirth')!.valueChanges.subscribe(val => {
      if (val && typeof val === 'object') {
        // Valore = NgbDateStruct; il formatter garantisce la visualizzazione dd/MM/yyyy
        this.dobFormatInvalid = false;
      }
    });
  }


  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true };
    }
  }

  // Submit del form: blocca l'invio se form invalido o data non conforme
  register() {
    if (this.registerForm.invalid || this.dobFormatInvalid) {
      this.registerForm.markAllAsTouched();
    }

    console.log(this.registerForm.value);

    this.accountService.register(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members')

      },
      error: error => {
        this.validationErrors = error;
      }
    });

  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  // Helper per il controllo della data di nascita (DOB)
  get dobCtrl(): AbstractControl | null { return this.registerForm.get('dateOfBirth'); }

  // Gestisce l'input manuale: applica regex dd/MM/yyyy e imposta
  // un errore custom 'dateFormat' sul controllo per mostrare il messaggio
  // e disabilitare il submit finché non è corretto.
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

  // Verifica: rispetta il formato dd/MM/yyyy e rappresenta una data reale
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
