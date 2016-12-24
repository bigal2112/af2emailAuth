import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventData {
  public currentUser: any;
  public eventsRef: any;
  public nextEvent: any;
  public guestsRef: any;


  constructor() {
    this.currentUser = firebase.auth().currentUser.uid;
    this.eventsRef = firebase.database().ref('events');
  }

  createEvent(eventInfo: any, ticketValue: any, guestList: any): any {
    let performerObj = eventInfo.performers
    let imageObj = eventInfo.image;
    
    // ----------------------------------------------------------
    // TODO : check for NULL values during the push to Firebase.
    // ----------------------------------------------------------
    return this.eventsRef.push({
      ownerId: this.currentUser,
      eventId: eventInfo.id,
      title: eventInfo.title,
      start_time: eventInfo.start_time,
      initialTicketPrice: ticketValue * 1.00,
      performer: performerObj.performer.name,
      image250: imageObj.block250.url,
      imageMed: imageObj.medium.url
    }).then(newEvent => {
      this.guestsRef = this.eventsRef.child(newEvent.key).child('guests');
      guestList.forEach(guest => {
        this.guestsRef.push({
          id: guest.id,
          username: guest.username,
          avatarURL: guest.avatarURL
        })
      });
    });
  }

  getEventsList() {
    return this.eventsRef.orderByChild('start_time');
  }

  getNextEvent(): any {
    this.currentUser = firebase.auth().currentUser.uid;
    return this.eventsRef.orderByChild('start_time').limitToFirst(1);
  }

  // geteventsRef(): any {
  //   this.currentUser = firebase.auth().currentUser.uid;
  //   return this.eventsRef.orderByChild('date');
  // }

  getEventDetail(eventId): any {
    return this.eventsRef.child(eventId);
  }

  addGuest(guestName, eventId, eventPrice, guestPicture = null): any {
    // console.log("eventPrice:");
    // console.log(eventPrice);

    return this.eventsRef.child(eventId).child('guestList').push({
      guestName: guestName
    }).then((newGuest) => {
      this.eventsRef.child(eventId).child('revenue').transaction((revenue: number) => {
        revenue += (eventPrice * 1);
        return revenue;
      });
    });
  }

}