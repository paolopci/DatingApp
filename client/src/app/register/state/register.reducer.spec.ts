import { registerActions } from './register.actions';
import { initialRegisterState, registerFeature } from './register.reducer';
import { RegisterRequest } from './register.models';
import { User } from '../../_models/User';

describe('registerFeature reducer', () => {
  const request: RegisterRequest = {
    gender: 'female',
    username: 'maria',
    knownAs: 'Maria',
    dateOfBirth: '1990-04-09',
    city: 'Roma',
    country: 'Italia',
    password: 'Pa$$1',
    confirmPassword: 'Pa$$1'
  };

  it('should expose the initial register state', () => {
    expect(initialRegisterState).toEqual({
      loading: false,
      validationErrors: undefined,
      submitted: false
    });
  });

  it('should set loading and clear validation errors when register is submitted', () => {
    const state = registerFeature.reducer(
      { loading: false, validationErrors: ['Username already exists'], submitted: false },
      registerActions.registerSubmitted({ request })
    );

    expect(state).toEqual({
      loading: true,
      validationErrors: undefined,
      submitted: true
    });
  });

  it('should clear loading and errors when register succeeds', () => {
    const user: User = { username: 'maria', token: 'jwt-token' };

    const state = registerFeature.reducer(
      { loading: true, validationErrors: ['old error'], submitted: true },
      registerActions.registerSucceeded({ user })
    );

    expect(state).toEqual({
      loading: false,
      validationErrors: undefined,
      submitted: true
    });
  });

  it('should expose validation errors when register fails', () => {
    const errors = ['Password is too short', 'Username is required'];

    const state = registerFeature.reducer(
      { loading: true, validationErrors: undefined, submitted: true },
      registerActions.registerFailed({ validationErrors: errors })
    );

    expect(state).toEqual({
      loading: false,
      validationErrors: errors,
      submitted: true
    });
  });

  it('should reset register state when the form is reset', () => {
    const state = registerFeature.reducer(
      { loading: true, validationErrors: ['Server error'], submitted: true },
      registerActions.registerFormReset()
    );

    expect(state).toEqual(initialRegisterState);
  });
});
