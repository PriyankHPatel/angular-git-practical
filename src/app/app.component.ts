import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-git-practical';
  constructor(
    private authService: AuthService
  ) {
    this.authService.isLoggedInUser();
  }
}
