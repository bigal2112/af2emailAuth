import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class GlobalVariables {
  public currentUserId: any;
  public currentUserDetails: any;
  public usersRef: any;
  public userDetails: any;
  public eventfulEventId: any;
  public firebaseEventId: any;
  public eventType: string;

  constructor() {
    console.log('Hello GlobalVariables Provider');
    this.usersRef = firebase.database().ref('/users');
    this.setCurrentUserDetals;
  }

  getCurrentUserDetals(): any {
    return this.userDetails;
  }

  getCurrentUserId(): any {
    return this.currentUserId;
  }

  setCurrentUserDetals(): any {
    this.currentUserId = firebase.auth().currentUser.uid;
    this.usersRef.child(this.currentUserId).on('value', data => {
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

  getEventType(): any {
    return this.eventType;
  }

  setEventType(eventType: string): any {
    this.eventType = eventType;
  }
}
