import { EmailRegex, PasswordRegex } from './../helper/utils';
import { AuthService } from './../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from './../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { FormStatus, getFormControlValue, LocalStorageKeyTypes } from '../helper/utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  logInForm: FormGroup;

  submittedInvalidForm: boolean = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.logInForm = new FormGroup({
      email: new FormControl(null, [Validators.required,
        // Validators.pattern(EmailRegex)
      ]),
      password: new FormControl(null, [Validators.required, 
        // Validators.minLength(6),
        // Validators.pattern(PasswordRegex)
      ])
    });
  }

  logIn() {
    if (this.logInForm) {
      if (this.logInForm && this.logInForm.status && this.logInForm.status.toUpperCase() === FormStatus.INVALID) {
        this.submittedInvalidForm = true;
        return;
      }

      const logInFormData: any = {
        email: getFormControlValue('email', this.logInForm),
        password: getFormControlValue('password', this.logInForm)
      }
      this.authService.logIn(logInFormData);
     
    }
  }
}
