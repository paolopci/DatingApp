import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { authActions } from './auth.actions';
import { AuthState } from './auth.models';

export const initialAuthState: AuthState = {
  currentUser: null,
  loading: false,
  error: null
};

const reducer = createReducer(
  initialAuthState,
  on(authActions.loginSubmitted, (state): AuthState => ({
    ...state,
    loading: true,
    error: null
  })),
  on(authActions.loginSucceeded, (state, { user }): AuthState => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null
  })),
  on(authActions.currentUserRestored, (state, { user }): AuthState => ({
    ...state,
    currentUser: user,
    error: null
  })),
  on(authActions.loginFailed, (state, { error }): AuthState => ({
    ...state,
    loading: false,
    error
  })),
  on(authActions.logoutRequested, (): AuthState => initialAuthState),
  on(authActions.currentUserPhotoUpdated, (state, { photoUrl }): AuthState => ({
    ...state,
    currentUser: state.currentUser ? { ...state.currentUser, photoUrl } : null
  }))
);

export const authFeature = createFeature({
  name: 'auth',
  reducer,
  extraSelectors: ({ selectCurrentUser }) => ({
    selectIsAuthenticated: createSelector(selectCurrentUser, currentUser => !!currentUser),
    selectToken: createSelector(selectCurrentUser, currentUser => currentUser?.token ?? null)
  })
});
