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
  public nextEvent: any = [];
  public otherDataRetrieved: boolean;
  public loader: any;

  constructor(public nav: NavController, public eventData: EventData, public loadingCtrl: LoadingController) {
    // this.callEventful();
    this.otherDataRetrieved = false;

    // ----------------------------------------------------------------------------------------------
    // TODO : get the next event as part of getting all the events. This will save on Firebase calls.
    // ----------------------------------------------------------------------------------------------
    // console.log("Retrieving first event - started");

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving events...."
    });
    this.loader.present();

    this.eventData.getNextEvent().on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          id: snap.key,
          name: snap.val().name,
          price: snap.val().price,
          date: snap.val().date
        });
      });
      this.nextEvent = rawList;

      if (this.otherDataRetrieved) {
        // dismiss loading control
        this.loader.dismiss();
      } else {
        this.otherDataRetrieved = true;
      }
    });
    // console.log("Retrieving first event - complete");

    // console.log("Retrieving events list - started");
    this.eventData.getEventList().on('value', snapshot => {

      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          id: snap.key,
          name: snap.val().name,
          price: snap.val().price,
          date: snap.val().date
        });
      });
      this.eventList = rawList;

      if (this.otherDataRetrieved) {
        // dismiss loading control
        this.loader.dismiss();
      } else {
        this.otherDataRetrieved = true;
      }

    // console.log("Retrieving events list - complete");
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

  callEventful() {
    var oArgs = {
      app_key: "n7XgQ8mk3VVsc6Qn",
      keywords: "Placebo"
    };

    let that = this;

    EVDB.API.call("json/events/search", oArgs, function (oData) {
      console.log(oData.events);

      let rawList = [];
      that.eventList = [];

      oData.events.event.forEach(event => {
        // console.log(event);
        let imageObj = event.image;
        // console.log(imageObj);

        let imageUrl = "img/emptyGroup.png";
        if(imageObj != null) {
          imageUrl = imageObj.medium.url;
        } 
        // console.log(imageUrl);

        rawList.push({
          id: event.id,
          venue_name: event.venue_name,
          start_time: event.start_time,
          venue_address: event.venue_address,
          country_name: event.country_name,
          title: event.title,
          image: imageUrl
        });
      });

      that.eventList = rawList;
      // console.log(that.eventList);  
    });
  }

}

