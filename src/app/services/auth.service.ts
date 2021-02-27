import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { Injectable } from '@angular/core';
import { LocalStorageKeyTypes } from '../helper/utils';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get isLoggedIn() {
    return this.loggedIn$.asObservable();
  }
  
  private loggedIn$ = new BehaviorSubject<boolean>(false);


  logedInUser: any = null;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  logIn(userData) {
    if (this.localStorageService) {
      let localStorageUserData: Array<any> = this.localStorageService.getLocalStorage(LocalStorageKeyTypes.USER_DETAIL);
      if (localStorageUserData && localStorageUserData.length > 0) {
        const loggedInUserDetail = localStorageUserData.find((eachUserData) => eachUserData.email && eachUserData.email == userData.email);
        if (loggedInUserDetail) {
          if (loggedInUserDetail.password == userData.password) {
            this.logedInUser = loggedInUserDetail;
            this.localStorageService.setLocalStorage(LocalStorageKeyTypes.LOGIN_USER, [this.logedInUser]);            
            this.loggedIn$.next(true);
            this.router.navigate(['/home']);
          } else {

            this.showUsernamePasswordIncorrect();
          }
        } else {
          this.showUsernamePasswordIncorrect();
        }
      } else {
        this.showUsernamePasswordIncorrect();
      }
    }
  }

  isLoggedInUser() {
    if (this.localStorageService) {
      let loggedInUserData = this.localStorageService.getLocalStorage(LocalStorageKeyTypes.LOGIN_USER);
      if (loggedInUserData && loggedInUserData.length && loggedInUserData.length === 1 ) {
        this.logedInUser = loggedInUserData[0];
        this.loggedIn$.next(true);
        this.router.navigate(['/home']);

      }
      else {
        this.loggedIn$.next(false);
        this.router.navigate(['/login']);
        
      }
    }
  }

  showUsernamePasswordIncorrect() {
    this.loggedIn$.next(false);
    window.alert('username or password incorrect');
    this.router.navigate(['/login'])
  }

  logout() {
    this.logedInUser = null;
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);

  }
}
