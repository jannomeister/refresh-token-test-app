import { Component } from '@angular/core';
import { AppService } from './app.service';
import { TokenService } from './core/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLoggedIn = false;
  user: string;

  constructor(
    private appService: AppService,
    private tokenService: TokenService
  ) {}

  async onLogin() {
    const data = {
      email: '', // your email address here...
      password: '', // your password here...
    };

    const result = await this.appService.login(data);

    this.tokenService.storeToken(result.access_token);

    this.isLoggedIn = true;
  }

  async me() {
    const result = await this.appService.me();

    this.user = JSON.stringify(result);
  }
}
