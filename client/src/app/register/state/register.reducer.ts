import { createFeature, createReducer, on } from '@ngrx/store';
import { registerActions } from './register.actions';
import { RegisterState } from './register.models';

export const initialRegisterState: RegisterState = {
  loading: false,
  validationErrors: undefined,
  submitted: false
};

const reducer = createReducer(
  initialRegisterState,
  on(registerActions.registerSubmitted, (state): RegisterState => ({
    ...state,
    loading: true,
    validationErrors: undefined,
    submitted: true
  })),
  on(registerActions.registerSucceeded, (state): RegisterState => ({
    ...state,
    loading: false,
    validationErrors: undefined
  })),
  on(registerActions.registerFailed, (state, { validationErrors }): RegisterState => ({
    ...state,
    loading: false,
    validationErrors
  })),
  on(registerActions.registerFormReset, (): RegisterState => initialRegisterState)
);

// createFeature genera anche selector fortemente tipizzati per loading, errori e submitted.
export const registerFeature = createFeature({
  name: 'register',
  reducer
});
