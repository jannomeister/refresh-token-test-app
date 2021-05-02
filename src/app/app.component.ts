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
  ) {
    const token = this.tokenService.getToken();

    this.isLoggedIn = !!token;
  }

  async onLogin() {
    try {
      const data = {
        email: 'jannodejesus4@gmail.com', // your email address here...
        password: 'Demo@2016', // your password here...
      };

      const result = await this.appService.login(data);

      this.tokenService.storeToken(result.access_token);

      this.isLoggedIn = true;
    } catch (err) {
      window.alert('Invalid username/password');
    }
  }

  async onLogout() {
    await this.appService.logout();

    this.tokenService.removeToken();

    this.isLoggedIn = false;
  }

  async me() {
    const result = await this.appService.me();

    this.user = JSON.stringify(result);
  }
}
