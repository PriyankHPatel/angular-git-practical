import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setLocalStorage(key, value: Array<any>) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeLocalStorage(key) {
    localStorage.removeItem(key);
  }

  getLocalStorage(key): Array<any> {
    return JSON.parse(localStorage.getItem(key)) ? JSON.parse(localStorage.getItem(key)) : [];
  }

}
