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
  public transactionsRef: any;
  // public balancesRef: any;
  public usersRef: any;
  public userDetails: any;

  // for the transactions
  public userUserIndex: any;
  public actualTicketCost: any;

  constructor(public userData: UserData, public globalVars: GlobalVariables) {
    this.currentUser = firebase.auth().currentUser.uid;
    this.usersRef = firebase.database().ref('users');
    this.eventsRef = firebase.database().ref('events');
    this.invitesRef = firebase.database().ref('invites');
    this.messagesRef = firebase.database().ref('messages')
    this.transactionsRef = firebase.database().ref('transactions')
    // this.balancesRef = firebase.database().ref('balances')
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
      actualTicketPrice: 0.00,
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

  addMessage(firebaseEventId: any, messageBody: any, ownerUsername: any): any {
    // console.log("firebaseEventId:" + firebaseEventId);
    // console.log("messageBody:" + messageBody);
    // console.log(userDetails);

    return this.messagesRef.push({
      firebaseEventId: firebaseEventId,
      messageBody: messageBody,
      messageCreatedOn: Date.now(),
      ownerId: this.globalVars.getCurrentUserId(),
      ownerUsername: ownerUsername
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

  updateFirebaseAfterTicketsBought(firebaseEventId: any, actualCostOfEvent: any, numberOfAcceptUsers: any,
    ticketsBoughtDateTime: any, invitedUsersArray: any): any {
    // this does ALL the updating after the creator has bought the tickets for an event. It will
    //  1. Calculate each ACCEPTed users actual ticket cost based on totle cost / number of users.
    //  2. Add a new transaction for each ACCEPTed user.
    //  3. Update the balance of creator/user buy the new calculated cost of a ticket.
    //  4. Update the balance of the user buy the new calculated cost of a ticket.
    //  5. Update the balance of the creator buy the new calculated cost of a ticket times the number of ACCEPTed users.
    //  6. Update the INVITES node with the actual ticket cost and date bought.
    //  7. Update the EVENTS node with the actual ticket cost and date bought.
    //  
    this.userDetails = this.globalVars.getCurrentUserDetals();

    //  1. Calculate each ACCEPTed users actual ticket cost based on totle cost / number of users.
    let numberOfUsers = numberOfAcceptUsers + 1;
    this.actualTicketCost = (actualCostOfEvent / numberOfUsers).toFixed(2);
    console.log("numberOfUsers: " + numberOfUsers);
    console.log("eachUsersCost: " + this.actualTicketCost);

    //  2. Add a new transaction for each ACCEPTed user.
    // ------------------------------------------------------------------------
    // TODO : find out whether we can do this in bulk rather than user by user
    // ------------------------------------------------------------------------
    invitedUsersArray.forEach(user => {
      if (user.inviteAccepted === "ACCEPT") {
        console.log("Adding transaction for user " + user.inviteeName);
        // first create the user/user/event index value
        // let userUserEventIndex = user.ownerId < user.inviteeId ?
        //   user.inviteOwnerId + "," + user.inviteInviteeId + "," + user.inviteFirebaseEventId :
        //   user.inviteInviteeId + "," + user.inviteOwnerId + "," + user.inviteFirebaseEventId;
        // let userFromToIndex = user.inviteOwnerId + user.inviteInviteeId;
        // let userToFromIndex = user.inviteInviteeId + user.inviteOwnerId;
        // let currentUserFirebaseId = this.globalVars.getCurrentUserId();

        this.transactionsRef.push({
          transFromUserId: user.inviteOwnerId,
          transToUserId: user.inviteInviteeId,
          transFromUserName: this.userDetails.username,
          transToUsername: user.inviteeName,
          transEventTitle: user.inviteEventTitle,
          transType: "EVENT",
          transCreatedOn: Date.now(),
          transAmount: this.actualTicketCost
        }).then((data) => {
          //  3. Update the balance of creator/user buy the new calculated cost of a ticket.
          this.usersRef.child(user.inviteOwnerId).child('balances').child(user.inviteInviteeId).child('balance').transaction((balance: number) => {
            balance += (this.actualTicketCost * 1);
            return balance;
          }).then((data) => {
            //  3. Update the balance of user/creator buy the new calculated cost of a ticket.
            this.usersRef.child(user.inviteInviteeId).child('balances').child(user.inviteOwnerId).child('balance').transaction((balance: number) => {
              balance += (this.actualTicketCost * -1);
              return balance;
            }).then((data) => {
              //  4. Update the balance of the user by the new calculated cost of a ticket.
              this.usersRef.child(user.inviteInviteeId).child('balance').transaction((balance: number) => {
                balance += (this.actualTicketCost * -1);
                return balance;
              }).then((data) => {
                //  5. Update the balance of the creator by the new calculated cost of a ticket times the number of ACCEPTed users.
                this.usersRef.child(user.inviteOwnerId).child('balance').transaction((balance: number) => {
                  balance += (this.actualTicketCost * 1);
                  return balance;
                }).then((data) => {
                  //  6. Update the INVITES node with the actual ticket cost and date bought.
                  this.invitesRef.child(user.inviteFirebaseId).update({
                    actualTicketPrice: this.actualTicketCost
                  });
                });
              });
            });
          });
        });
      } else {    // if (user.inviteAccepted === "ACCEPT")
        this.invitesRef.child(user.inviteFirebaseId).remove();
      };
    });

    this.addMessage(firebaseEventId, "Tickets for this event have now been bought", this.userDetails.username)

    //  7. Update the EVENTS node with the actual ticket cost and date bought.
    return this.eventsRef.child(firebaseEventId).update({
      actualTicketPrice: this.actualTicketCost,
      ticketsBoughtDateTime: Date.now()
    });

  }
}