import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Register } from './register';
import { registerActions } from './state/register.actions';
import { Store } from '@ngrx/store';

describe('Register', () => {
  let fixture: ComponentFixture<Register>;
  let component: Register;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState: {
            register: {
              loading: false,
              validationErrors: undefined,
              submitted: false
            }
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should dispatch registerSubmitted with the form payload when the form is valid', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.registerForm.setValue({
      gender: 'female',
      username: 'maria',
      knownAs: 'Maria',
      dateOfBirth: { year: 1990, month: 4, day: 9 },
      city: 'Roma',
      country: 'Italia',
      password: 'Pa$$1',
      confirmPassword: 'Pa$$1'
    });

    component.register();

    expect(dispatchSpy).toHaveBeenCalledOnceWith(registerActions.registerSubmitted({
      request: {
        gender: 'female',
        username: 'maria',
        knownAs: 'Maria',
        dateOfBirth: '1990-04-09',
        city: 'Roma',
        country: 'Italia',
        password: 'Pa$$1',
        confirmPassword: 'Pa$$1'
      }
    }));
  });

  it('should mark the form as touched and not dispatch when the form is invalid', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const markAllAsTouchedSpy = spyOn(component.registerForm, 'markAllAsTouched').and.callThrough();

    component.register();

    expect(markAllAsTouchedSpy).toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
