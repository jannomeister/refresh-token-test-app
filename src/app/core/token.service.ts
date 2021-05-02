import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  storeToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string {
    return localStorage.getItem('access_token');
  }

  removeToken(): void {
    localStorage.clear();
  }
}
