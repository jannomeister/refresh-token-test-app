import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  async login(data): Promise<any> {
    return this.http
      .post(`${this.baseUrl}/user/login`, data, { withCredentials: true })
      .toPromise();
  }

  async me() {
    return this.http.get(`${this.baseUrl}/user`).toPromise();
  }
}
