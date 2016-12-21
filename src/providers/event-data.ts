import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventData {
  public currentUser: any;
  public eventList: any;
  public nextEvent: any;
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

  getNextEvent(): any {
    this.currentUser = firebase.auth().currentUser.uid;
    return this.eventList.orderByChild('date').limitToFirst(1);
  }

  getEventList(): any {
    this.currentUser = firebase.auth().currentUser.uid;
    return this.eventList.orderByChild('date');
  }

  getEventDetail(eventId): any {
    return this.eventList.child(eventId);
  }

  getGuestList(eventId) {
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
    });
  }

}