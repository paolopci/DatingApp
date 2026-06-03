import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../_models/User';
import { environment } from '../../environments/environment.development';
import { LoginCredentials } from '../auth/state/auth.models';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  login(credentials: LoginCredentials) {
    return this.http.post<User>(this.baseUrl + 'account/login', credentials);
  }

  register(model: unknown) {
    return this.http.post<User>(this.baseUrl + 'account/register', model);
  }

  persistCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getPersistedCurrentUser(): User | null {
    const userString = localStorage.getItem('user');
    if (!userString) return null;

    try {
      return JSON.parse(userString) as User;
    } catch {
      this.clearPersistedUser();
      return null;
    }
  }

  clearPersistedUser() {
    localStorage.removeItem('user');
  }

  updatePersistedCurrentUser(update: Partial<User>) {
    const user = this.getPersistedCurrentUser();
    if (!user) return;

    this.persistCurrentUser({ ...user, ...update });
  }
}
