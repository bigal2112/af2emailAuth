import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';
import { GlobalVariables } from '../../providers/global-variables';

@Component({
  selector: 'page-event-detail-messages',
  templateUrl: 'event-detail-messages.html'
})
export class EventDetailMessagesPage {

  firebaseEventId: any;
  unorderedMessages: any;
  eventMessages: any;
  loader: any;
  currentUserDetails: any;
  newMessage: any;

  constructor(public nav: NavController, public eventData: EventData, public globaVars: GlobalVariables, public loadingCtrl: LoadingController) {


    this.firebaseEventId = this.globaVars.getFirebaseEventId();
    this.currentUserDetails = this.globaVars.getCurrentUserDetals();

    // // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving event messages...."
    });
    this.loader.present();

    this.eventData.getEventMessages(this.firebaseEventId).on('value', data => {
      // console.log(data);
      this.unorderedMessages = [];
      this.eventMessages = [];
      data.forEach(snap => {
        this.unorderedMessages.push({
          ownerId: snap.val().ownerId,
          ownerUsername: snap.val().ownerUsername,
          createdOn: snap.val().messageCreatedOn,
          body: snap.val().messageBody
        });
      })

      console.log(this.unorderedMessages);

      this.eventMessages = this.unorderedMessages.sort(this.sortByCreatedOnDesc);
      console.log(this.eventMessages);

      this.loader.dismiss();
    });
  }

  addMessage() {
    console.log("Adding message");

    // if we have a message to add
    if (this.newMessage != null && typeof (this.newMessage) != 'undefined') {
      this.eventData.addMessage(this.firebaseEventId, this.newMessage, this.currentUserDetails).then(() => {
        this.newMessage = "";
      });
    }
  }

  sortByCreatedOnDesc(a, b) {
    return b.createdOn - a.createdOn;
  }
}
