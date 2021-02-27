import { FormGroup } from '@angular/forms';

export function getFormControlValue(formControlName: string, formGroup: FormGroup) {
    if (formControlName && formGroup) {
        return formGroup.get(formControlName) && formGroup.get(formControlName).value;
    }
}

export enum LocalStorageKeyTypes {
    USER_DETAIL = 'userDetail',
    GITHUB_USERS_LIST = 'githubUserList',
    LOGIN_USER = 'loginUser'
}

export enum FormStatus {
    VALID = 'VALID',
    INVALID = 'INVALID'
}

export function emailValidator(value: string): boolean {
    if (value) {
        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regex.test(value.toLocaleLowerCase());
    }
}