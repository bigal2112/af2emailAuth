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

    console.log("createEvent");
    let performerObj = eventInfo.performers
    // console.log(performerObj);

    // let performer = "";
    // if (performerObj != null) {
    //   performer = performerObj.performer.name
    // } else {
    //   performer = eventInfo.title;
    // }
    let imageObj = eventInfo.image;

    // console.log("Performer:" + performer);

    // ----------------------------------------------------------
    // TODO : check for NULL values during the push to Firebase.
    // ----------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------
    // TODO : there maybe cases where there are no guests, this would pass a null value and break the forEach
    // -------------------------------------------------------------------------------------------------------
    return this.eventsRef.push({
      ownerId: this.currentUser,
      eventId: eventInfo.id,
      title: eventInfo.title,
      start_time: eventInfo.start_time,
      initialTicketPrice: ticketValue * 1.00,
      performer: performerObj != null ? performerObj.performer.name : eventInfo.title,
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

  getMyEvents() {
    this.currentUser = firebase.auth().currentUser.uid;
    return this.eventsRef.orderByChild('ownerId').equalTo(this.currentUser);
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