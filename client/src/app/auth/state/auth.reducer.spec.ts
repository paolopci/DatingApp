import { User } from '../../_models/User';
import { authActions } from './auth.actions';
import { authFeature, initialAuthState } from './auth.reducer';

describe('authFeature reducer', () => {
  const user: User = {
    username: 'maria',
    token: 'jwt-token',
    photoUrl: 'https://cdn.test/maria.jpg',
    gender: 'female'
  };

  it('should expose the initial auth state', () => {
    expect(initialAuthState).toEqual({
      currentUser: null,
      loading: false,
      error: null
    });
  });

  it('should set loading and clear errors when login is submitted', () => {
    const state = authFeature.reducer(
      { currentUser: null, loading: false, error: 'old error' },
      authActions.loginSubmitted({ credentials: { username: 'maria', password: 'Pa$$1' } })
    );

    expect(state).toEqual({
      currentUser: null,
      loading: true,
      error: null
    });
  });

  it('should store the current user when login succeeds', () => {
    const state = authFeature.reducer(
      { currentUser: null, loading: true, error: null },
      authActions.loginSucceeded({ user })
    );

    expect(state).toEqual({
      currentUser: user,
      loading: false,
      error: null
    });
  });

  it('should clear current user when logout is requested', () => {
    const state = authFeature.reducer(
      { currentUser: user, loading: false, error: null },
      authActions.logoutRequested()
    );

    expect(state).toEqual(initialAuthState);
  });

  it('should update the current user photo url without changing the token', () => {
    const state = authFeature.reducer(
      { currentUser: user, loading: false, error: null },
      authActions.currentUserPhotoUpdated({ photoUrl: 'https://cdn.test/new-main.jpg' })
    );

    expect(state.currentUser).toEqual({
      ...user,
      photoUrl: 'https://cdn.test/new-main.jpg'
    });
  });
});
