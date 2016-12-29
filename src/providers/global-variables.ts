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
  public firebaseInviteID: any;
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

  getFirebaseInviteId(): any {
    return this.firebaseInviteID;
  }

  setEventIds(eventfulId: any, firebaseId: any, firebaseInviteID: any): any {
    // console.log("Setting IDs - Eventful: " + eventfulId + ", Firebase: " + firebaseId + ", Invite: " + firebaseInviteID);
    this.eventfulEventId = eventfulId;
    this.firebaseEventId = firebaseId;
    this.firebaseInviteID = firebaseInviteID;
  }

  getEventType(): any {
    return this.eventType;
  }

  setEventType(eventType: string): any {
    this.eventType = eventType;
  }
}
