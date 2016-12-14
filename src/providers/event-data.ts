import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventData {
  public currentUser: any;
  public eventList: any;
  public guestsList: any;
  

  constructor() {
    this.currentUser = firebase.auth().currentUser.uid;
    this.eventList = firebase.database().ref('userProfile/' + this.currentUser + '/eventList');
  }

  createEvent(eventName: string, eventDate: string, eventPrice: number, eventCost: number): any {
    return this.eventList.push({
      name: eventName,
      date: eventDate,
      price: eventPrice * 1.00,
      cost: eventCost * 1.00,
      revenue: eventCost * -1.00
    }).then(newEvent => {
      this.eventList.child(newEvent.key).child('id').set(newEvent.key);
    });
  }

  getEventList(): any {
    this.currentUser = firebase.auth().currentUser.uid;
    this.eventList = firebase.database().ref('userProfile/' + this.currentUser + '/eventList');
    return this.eventList;
  }

  getEventDetail(eventId): any {
    return this.eventList.child(eventId);
  }

  getGuestList(eventId) {
    // console.log("event-data.getGuestList:" + eventId);
    this.guestsList = firebase.database().ref('userProfile/' + this.currentUser + '/eventList/' + eventId + "/guestList");
    return this.guestsList;
  }

  addGuest(guestName, eventId, eventPrice, guestPicture = null): any {
    // console.log("eventPrice:");
    // console.log(eventPrice);

    return this.eventList.child(eventId).child('guestList').push({
      guestName: guestName
    }).then((newGuest) => {
      this.eventList.child(eventId).child('revenue').transaction((revenue: number) => {
        revenue += (eventPrice * 1);
        return revenue;
      });

      // if (guestPicture != null) {
      //   this.avatarPictureRef.child(newGuest.key).child('profilePicture.png')
      //     .putString(guestPicture, 'base64', { contentType: 'image/png' })
      //     .then((savedPicture) => {
      //       this.eventList.child(eventId).child('guestList').child(newGuest.key).child('profilePicture')
      //         .set(savedPicture.downloadURL);
      //     });
      // }
    });
  }

}