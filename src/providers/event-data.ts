import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class EventData {
  public currentUser: any;
  public eventsRef: any;
  public nextEvent: any;
  public guestsRef: any;
  public invitesRef: any;

  constructor() {
    this.currentUser = firebase.auth().currentUser.uid;
    this.eventsRef = firebase.database().ref('events');
    this.invitesRef = firebase.database().ref('invites');
  }

  createEvent(eventInfo: any, ticketValue: any, guestList: any): any {

    console.log("createEvent");
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
      performer: performerObj != null ? performerObj.performer.name : eventInfo.title,
      image250: imageObj.block250.url,
      imageMed: imageObj.medium.url
    }).then(newEvent => {
      // now create the invites if there are any
      if (guestList != null) {

        guestList.forEach(guest => {
          this.invitesRef.push({
            ownerId: this.currentUser,
            inviteeId: guest.id,
            inviteeName: guest.username,
            inviteeAvatarURL: guest.avatarURL,
            eventId: eventInfo.id,
            title: eventInfo.title,
            start_time: eventInfo.start_time,
            initialTicketPrice: ticketValue * 1.00,
            performer: performerObj != null ? performerObj.performer.name : eventInfo.title,
            image250: imageObj.block250.url,
            imageMed: imageObj.medium.url
          })
        });
      }
    });
  }

  getEventsList() {
    return this.eventsRef.orderByChild('start_time');
  }

  getMyEvents() {
    this.currentUser = firebase.auth().currentUser.uid;
    return this.eventsRef.orderByChild('ownerId').equalTo(this.currentUser);
  }

  getMyInvitedEvents() {
    this.currentUser = firebase.auth().currentUser.uid;
    return this.invitesRef.orderByChild('inviteeId').equalTo(this.currentUser);
  }

  // getNextEvent(): any {
  //   this.currentUser = firebase.auth().currentUser.uid;
  //   return this.eventsRef.orderByChild('start_time').limitToFirst(1);
  // }

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