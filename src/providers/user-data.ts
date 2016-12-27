import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class UserData {

  public users: any;

  constructor() {
    this.users = firebase.database().ref('/users');
  }

  getAllUsers(): any {
    return this.users;
  }

  getUserDetails(userId): any {
    return this.users.child(userId);
  }

}
