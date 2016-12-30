import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { UserData } from '../providers/user-data';
import { GlobalVariables } from '../providers/global-variables';

@Injectable()
export class EventData {
  public currentUser: any;
  public eventsRef: any;
  public nextEvent: any;
  public guestsRef: any;
  public invitesRef: any;
  public messagesRef: any;
  public usersRef: any;
  public userDetails: any;

  constructor(public userData: UserData, public globalVars: GlobalVariables) {
    this.currentUser = firebase.auth().currentUser.uid;
    this.usersRef = firebase.database().ref('users');
    this.eventsRef = firebase.database().ref('events');
    this.invitesRef = firebase.database().ref('invites');
    this.messagesRef = firebase.database().ref('messages')
  }

  createEvent(eventInfo: any, ticketValue: any, guestList: any): any {

    // console.log("createEvent");
    // console.log(eventInfo);

    this.userDetails = this.globalVars.getCurrentUserDetals();
    // console.log("User details retrieved");
    // console.log(this.userDetails);

    let performerObj = eventInfo.performers
    let imageObj = eventInfo.image;

    // create the event
    return this.eventsRef.push({
      ownerId: this.currentUser,
      eventId: eventInfo.id,
      title: eventInfo.title,
      start_time: eventInfo.start_time,
      initialTicketPrice: ticketValue * 1.00,
      performer: performerObj != null ? performerObj.performer.name : eventInfo.title,
      image250: imageObj != null ? imageObj.block250.url : null,
      image188: imageObj != null ? imageObj.block188.url : null,
      imageMed: imageObj != null ? imageObj.medium.url : null,
      numberOfInvites: guestList != null ? guestList.length : 0
    }).then(newEvent => {

      // create the initial messages
      this.messagesRef.push({
        firebaseEventId: newEvent.key,
        ownerId: this.currentUser,
        ownerUsername: this.userDetails.username,
        messageCreatedOn: Date.now(),
        messageBody: "Event created."
      }).then(data => {

        // console.log("Message created");

        // now create the invites, if there are any
        if (guestList != null) {

          guestList.forEach(guest => {
            this.invitesRef.push({
              firebaseEventId: newEvent.key,
              ownerId: this.currentUser,
              inviteeId: guest.id,
              inviteeName: guest.username,
              inviteeAvatarURL: guest.avatarURL,
              eventId: eventInfo.id,
              title: eventInfo.title,
              start_time: eventInfo.start_time,
              initialTicketPrice: ticketValue * 1.00,
              actualTicketPrice: 0.00,
              performer: performerObj != null ? performerObj.performer.name : eventInfo.title,
              image250: imageObj != null ? imageObj.block250.url : null,
              image188: imageObj != null ? imageObj.block188.url : null,
              imageMed: imageObj != null ? imageObj.medium.url : null,
              inviteAccepted: "NOT YET"
            });
          });

          // console.log("Guest created");
        }
      });

    });
  }


  getEventsList() {
    return this.eventsRef.orderByChild('start_time');
  }

  getMyEvents() {
    this.currentUser = firebase.auth().currentUser.uid;
    // console.log("Getting my event with ID: " + this.currentUser);
    return this.eventsRef.orderByChild('ownerId').equalTo(this.currentUser);
  }

  getMyInvitedEvents() {
    this.currentUser = firebase.auth().currentUser.uid;
    // console.log("Getting invited with ID: " + this.currentUser);
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

  getEventDetail(firebaseEventId): any {
    return this.eventsRef.child(firebaseEventId);
  }

  // addGuest(guestName, eventId, eventPrice, guestPicture = null): any {
  //   // console.log("eventPrice:");
  //   // console.log(eventPrice);

  //   return this.eventsRef.child(eventId).child('guestList').push({
  //     guestName: guestName
  //   }).then((newGuest) => {
  //     this.eventsRef.child(eventId).child('revenue').transaction((revenue: number) => {
  //       revenue += (eventPrice * 1);
  //       return revenue;
  //     });
  //   });
  // }

  getEventMessages(firebaseEventId) {
    console.log("Retrieving messages from Id: " + firebaseEventId);
    return this.messagesRef.orderByChild('firebaseEventId').equalTo(firebaseEventId);
  }

  addMessage(firebaseEventId: any, messageBody: any, userDetails: any): any {
    // console.log("firebaseEventId:" + firebaseEventId);
    // console.log("messageBody:" + messageBody);
    // console.log(userDetails);
    
    return this.messagesRef.push({
      firebaseEventId: firebaseEventId,
      messageBody: messageBody,
      messageCreatedOn: Date.now(),
      ownerId: this.globalVars.getCurrentUserId(),
      ownerUsername: userDetails.username
    })
  }

  getInvitedUsers(firebaseEventId) {
    // console.log("Retrieving users from Id: " + firebaseEventId);
    return this.invitesRef.orderByChild('firebaseEventId').equalTo(firebaseEventId);
  }

  getInviteDetails(firebaseInviteId) {
    // console.log("Retrieving invite details from Id: " + firebaseInviteId);
    return this.invitesRef.child(firebaseInviteId);
  }

  updateInviteAcceptedStatus(firebaseInviteId: any, newStatus: string) {
    // console.log("Updating invite details for Id: " + firebaseInviteId + " with new status of " + newStatus);
    return this.invitesRef.child(firebaseInviteId).update({
      inviteAccepted: newStatus
    });
  }

}