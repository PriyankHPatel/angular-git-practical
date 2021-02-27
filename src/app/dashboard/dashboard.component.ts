import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './../services/local-storage.service';
import { GitDataService } from './../services/git-data.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { getFormControlValue, LocalStorageKeyTypes } from '../helper/utils';
import { debounceTime, take } from 'rxjs/operators';
import {debounce as _debounce} from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  searchForGithub: FormGroup;

  localStorageGithubUserListData: Array<any>;

  searchText: string = null;

  githubGridFormGroup: FormGroup;

  gridSearchSubscription: Subscription;

  logedInUser: any = null; 

  gridSearchObserver: Observable<any> = new Observable;
  constructor(
    private gitDataService: GitDataService ,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.logedInUser = this.authService.logedInUser;
  }

  ngOnInit() {
    this.localStorageGithubUserListData = this.localStorageService.getLocalStorage(this.logedInUser.email);
    this.createGithubProfileSearchForm();
    this.createGithubGridForm();
  }

  ngAfterViewInit() {
    this.subscribeToSearchGridData();
  }

  createGithubProfileSearchForm() {
    this.searchForGithub = new FormGroup({
      reprositoryName: new FormControl(null)
    });
  }

  createGithubGridForm() {
    this.githubGridFormGroup = new FormGroup({
      gridSearch: new FormControl(null)
    })
  }


  searchForGithubProfile() {
    const gitUserName = getFormControlValue('reprositoryName', this.searchForGithub)
    if (this.gitDataService && gitUserName) {
      this.gitDataService.getProfileData(gitUserName).toPromise()
      .then((response) => {
        if (response) {
          this.handleValidResponseOnProfileSearch(response);
          this.searchForGithub.reset();
        }
        else {
          window.alert('User not found.');
        }
      }, (error) => {
        if (error.status && error.status === 404) {
          window.alert('username not found');
        } else {
          console.error('unknown error occured', error);
        }
      })
    }
  }

  handleValidResponseOnProfileSearch(response: any) {
    const userProfileData = {
      id: response.id ? response.id : null,
      login: response.login ? response.login : null,
      name: response.name ? response.name : null,
      avatar_url: response.avatar_url ? response.avatar_url : null,
      public_repos: response.public_repos ? response.public_repos : null
    }

    if (this.localStorageService) {
      const localStorageGithubUserListData: Array<any> = this.localStorageService.getLocalStorage(this.logedInUser.email);
      if (localStorageGithubUserListData && localStorageGithubUserListData.length > 0) {
        if (!(localStorageGithubUserListData.find((eachGithubUserList) => eachGithubUserList.id == userProfileData.id))) {
          localStorageGithubUserListData.push(userProfileData);
          this.localStorageService.setLocalStorage(this.logedInUser.email, localStorageGithubUserListData);
        }
      } else {
        this.localStorageService.setLocalStorage(this.logedInUser.email, [userProfileData]);
        // this.localStorageGithubUserListData = [userProfileData];
      }

      if (this.githubGridFormGroup && this.githubGridFormGroup.get('gridSearch')) {
        this.githubGridFormGroup.get('gridSearch').setValue(null);
      }
    }
  }

  deleteRowClickHandler(eachGithubUserData) {
    if (eachGithubUserData && eachGithubUserData.id) {
      this.localStorageGithubUserListData = this.localStorageGithubUserListData.filter(eachGithubUserList => !(eachGithubUserList.id == eachGithubUserData.id));
      const localStorageGithubUserListData: Array<any> = this.localStorageService.getLocalStorage(this.logedInUser.email).filter(eachGithubUserList => !(eachGithubUserList.id == eachGithubUserData.id))
      this.localStorageService.setLocalStorage(this.logedInUser.email, localStorageGithubUserListData);
    }
  }

  logoutClickHandler() {
    this.localStorageService.removeLocalStorage(LocalStorageKeyTypes.LOGIN_USER);
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.gridSearchSubscription) {
      this.gridSearchSubscription.unsubscribe();
    }
  }

  subscribeToSearchGridData() {
    if (this.githubGridFormGroup && this.githubGridFormGroup.get('gridSearch')) {
      this.gridSearchSubscription = this.githubGridFormGroup.get('gridSearch').valueChanges.pipe(debounceTime(0))
      .subscribe((value) => {
        console.log(value);
        if (value) {
          this.localStorageGithubUserListData = this.localStorageService.getLocalStorage(this.logedInUser.email);
          this.localStorageGithubUserListData = this.localStorageGithubUserListData.filter(eachRow =>
            (eachRow.login && eachRow.login.toString().includes(value)) ||
            (eachRow.name && eachRow.name.toString().includes(value)) ||
            (eachRow.public_repos && eachRow.public_repos.toString().includes(value))
          );
        } else {
          this.localStorageGithubUserListData = this.localStorageService.getLocalStorage(this.logedInUser.email);
        }
      })    
    }
  }
}
