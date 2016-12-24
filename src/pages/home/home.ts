import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { EventAddPage } from '../event-add/event-add';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data';

// declare this variable so the typescript doesn't balk at google
declare var EVDB: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public eventList: any = [];
  public loader: any;
  public eventsCntr: number;
  public numberOfNotifications: number = 3;

  firstEventId: any;
  firstEventName: any;
  firstEventPrice: any;
  firstEventDate: any;
  firstEventImage250: any;
  firstEventImageMed: any;

  constructor(public nav: NavController, public eventData: EventData, public loadingCtrl: LoadingController) {

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving your events...."
    });
    this.loader.present();

    // console.log("Retrieving events list - started");
    this.eventData.getEventsList().on('value', snapshot => {

      this.eventList = [];
      this.eventsCntr = 0;
      snapshot.forEach(snap => {

        if (this.eventsCntr === 0) {

          this.firstEventId = snap.key;
          this.firstEventName = snap.val().title;
          this.firstEventPrice = snap.val().initialTicketPrice;
          this.firstEventDate = snap.val().start_time;
          this.firstEventImage250 = snap.val().image250;
          this.firstEventImageMed = snap.val().imageMed;

        } else {
          this.eventList.push({
            id: snap.key,
            name: snap.val().title,
            price: snap.val().initialTicketPrice,
            date: snap.val().start_time,
            image250: snap.val().image250,
            imageMed: snap.val().imageMed
          });
        }

        this.eventsCntr++;
      });
      // console.log("Retrieving events list - complete");
      this.loader.dismiss();
      // console.log(this.nextEvent);
      // console.log(this.eventList);
    });

  }

  goToEventDetail(eventId) {
    this.nav.push(EventDetailPage, {
      eventId: eventId,
    });
  }

  goToProfile() {
    this.nav.push(ProfilePage);
  }

  addEvent() {
    this.nav.push(EventAddPage);
  }

  // callEventful() {
  //   var oArgs = {
  //     app_key: "n7XgQ8mk3VVsc6Qn",
  //     keywords: "Placebo"
  //   };

  //   let that = this;

  //   EVDB.API.call("json/events/search", oArgs, function (oData) {
  //     console.log(oData.events);

  //     let rawList = [];
  //     that.eventList = [];

  //     oData.events.event.forEach(event => {
  //       // console.log(event);
  //       let imageObj = event.image;
  //       // console.log(imageObj);

  //       let imageUrl = "img/emptyGroup.png";
  //       if(imageObj != null) {
  //         imageUrl = imageObj.medium.url;
  //       } 
  //       // console.log(imageUrl);

  //       rawList.push({
  //         id: event.id,
  //         venue_name: event.venue_name,
  //         start_time: event.start_time,
  //         venue_address: event.venue_address,
  //         country_name: event.country_name,
  //         title: event.title,
  //         image: imageUrl
  //       });
  //     });

  //     that.eventList = rawList;
  //     // console.log(that.eventList);  
  //   });
  // }

}

