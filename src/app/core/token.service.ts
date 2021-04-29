import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  storeToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getToken(): string {
    return localStorage.getItem('accessToken');
  }

  removeToken(): void {
    localStorage.clear();
  }
}
