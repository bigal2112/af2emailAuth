import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class GlobalVariables {
  public currentUser: any;
  public currentUserDetails: any;
  public usersRef: any;
  public userDetails: any;
  public eventfulEventId: any;
  public firebaseEventId: any;

  constructor() {
    console.log('Hello GlobalVariables Provider');
    this.usersRef = firebase.database().ref('/users');
    this.setCurrentUserDetals;
  }

  getCurrentUserDetals(): any {
    return this.userDetails;
  }

  setCurrentUserDetals(): any {
    this.currentUser = firebase.auth().currentUser.uid;
    this.usersRef.child(this.currentUser).on('value', data => {
      this.userDetails = data.val();
    });
  }

  getEventfulEventId(): any {
    return this.eventfulEventId;
  }

  getFirebaseEventId(): any {
    return this.firebaseEventId;
  }

  setEventIds(eventfulId: any, firebaseId: any): any {
    // console.log("Setting IDs - Eventful: " + eventfulId + ", Firebase: " + firebaseId);
    this.eventfulEventId = eventfulId;
    this.firebaseEventId = firebaseId;
  }
}
