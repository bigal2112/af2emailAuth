import { Component, NgZone } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';
import { GlobalVariables } from '../../providers/global-variables';
// import { TimeSince } from '../../pipes/time-since';

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
  ngZone: any;

  constructor(public nav: NavController, public eventData: EventData, public globalVars: GlobalVariables, public loadingCtrl: LoadingController) {

    this.ngZone = new NgZone({ enableLongStackTrace: false });
    this.firebaseEventId = this.globalVars.getFirebaseEventId();
    this.currentUserDetails = this.globalVars.getCurrentUserDetals();

    // // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving event messages...."
    });
    this.loader.present();

    this.eventData.getEventMessages(this.firebaseEventId).on('value', data => {
      // console.log(data);

      this.ngZone.run(() => {
        this.unorderedMessages = [];
        this.eventMessages = [];
        data.forEach(snap => {
          this.unorderedMessages.push({
            ownerId: snap.val().ownerId,
            ownerUsername: snap.val().ownerUsername,
            createdOn: snap.val().messageCreatedOn,
            body: snap.val().messageBody
          });
        });

        console.log(this.unorderedMessages);

        this.eventMessages = this.unorderedMessages.sort(this.sortByCreatedOnDesc);
        console.log(this.eventMessages);
      });   // this.ngZone.run()
      
      this.loader.dismiss();
    });
  }

  addMessage() {
    console.log("Adding message");

    // if we have a message to add
    if (this.newMessage != null && typeof (this.newMessage) != 'undefined') {
      this.eventData.addMessage(this.firebaseEventId, this.newMessage, this.currentUserDetails.username).then(() => {
        this.newMessage = "";
      });
    }
  }

  sortByCreatedOnDesc(a, b) {
    return b.createdOn - a.createdOn;
  }
}
