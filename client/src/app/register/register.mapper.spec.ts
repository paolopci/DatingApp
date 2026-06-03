import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { RegisterFormValue } from './state/register.models';
import { mapRegisterFormToRequest } from './register';

describe('mapRegisterFormToRequest', () => {
  it('should convert the date picker value to an ISO yyyy-MM-dd date', () => {
    const formValue: RegisterFormValue = {
      gender: 'female',
      username: 'maria',
      knownAs: 'Maria',
      dateOfBirth: { year: 1990, month: 4, day: 9 } satisfies NgbDateStruct,
      city: 'Roma',
      country: 'Italia',
      password: 'Pa$$1',
      confirmPassword: 'Pa$$1'
    };

    expect(mapRegisterFormToRequest(formValue)).toEqual({
      gender: 'female',
      username: 'maria',
      knownAs: 'Maria',
      dateOfBirth: '1990-04-09',
      city: 'Roma',
      country: 'Italia',
      password: 'Pa$$1',
      confirmPassword: 'Pa$$1'
    });
  });
});
