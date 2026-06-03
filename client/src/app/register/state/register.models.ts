import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export interface RegisterRequest {
  gender: string;
  username: string;
  knownAs: string;
  dateOfBirth: string;
  city: string;
  country: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormValue {
  gender: string;
  username: string;
  knownAs: string;
  dateOfBirth: NgbDateStruct;
  city: string;
  country: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterState {
  loading: boolean;
  validationErrors: string[] | undefined;
  submitted: boolean;
}
