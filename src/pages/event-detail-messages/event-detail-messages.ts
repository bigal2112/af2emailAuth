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
  eventMessages: any;
  loader: any;

  constructor(public nav: NavController, public eventData: EventData, public globaVars: GlobalVariables, public loadingCtrl: LoadingController) {
    this.eventMessages = [];

    this.firebaseEventId = this.globaVars.getFirebaseEventId();

    // // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving event messages...."
    });
    this.loader.present();

    this.eventData.getEventMessages(this.firebaseEventId).on('value', data => {
      // console.log(data);

      data.forEach(snap => {
        this.eventMessages.push({
          ownerId: snap.val().ownerId,
          ownerUsername: snap.val().ownerUsername,
          createdOn: snap.val().messageCreatedOn,
          body: snap.val().messageBody
        });
      })

      this.loader.dismiss();
    });
  }
}
