import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GitDataService {

  constructor(
    private http: HttpClient
  ) { }

  
  dataPath: string = 'https://api.github.com/users/';

  getProfileData(username: string) {
    const profilePath: string = this.dataPath + username;
    return this.http.get(profilePath);
  }

  getUsers() {
    return this.http.get('https://reqres.in/api/users');
  }
}
