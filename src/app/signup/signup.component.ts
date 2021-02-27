import { EmailRegex, PasswordRegex } from './../helper/utils';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormStatus, getFormControlValue, LocalStorageKeyTypes } from '../helper/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  submittedInvalidForm: boolean = false;
  constructor(
    private localsStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createSignupForm();

  }

  createSignupForm() {
    this.signupForm = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      "email": new FormControl(null, [Validators.required,
        Validators.pattern(EmailRegex)]),
      "password": new FormControl(null, [Validators.required, Validators.minLength(6),
        
        Validators.pattern(PasswordRegex)])
    })
  }


  signup() {
    if (this.signupForm) {
      if (this.signupForm.status && this.signupForm.status.toUpperCase() === FormStatus.INVALID) {
        this.submittedInvalidForm = true;
        return;
      }

      const signupData: any = {
        name: getFormControlValue('name', this.signupForm),
        email: getFormControlValue('email', this.signupForm),
        password: getFormControlValue('password', this.signupForm)
      }

      if (this.localsStorageService) {
        let localStorageUserData: Array<any> = this.localsStorageService.getLocalStorage(LocalStorageKeyTypes.USER_DETAIL);
        if (localStorageUserData && localStorageUserData.length > 0) {
          localStorageUserData.push(signupData);
          this.localsStorageService.setLocalStorage(LocalStorageKeyTypes.USER_DETAIL, localStorageUserData);
        } else {
          this.localsStorageService.setLocalStorage(LocalStorageKeyTypes.USER_DETAIL, [signupData]);
        }
        window.alert('sign up successful please login');
        this.router.navigate(['/login']);
      }
    }
  }

}
