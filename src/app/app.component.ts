import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'refresh-token-test-app';

  constructor(private appService: AppService) {}

  async onRequest() {
    const todo = await this.appService.fetchTodo();

    console.log('todo: ', todo);
  }
}
