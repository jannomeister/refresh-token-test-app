import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AppService {
  constructor(private http: HttpClient) {}

  async fetchTodo() {
    return this.http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .toPromise();
  }
}
