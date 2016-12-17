import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { EventCreatePage } from '../event-create/event-create';
import { EventDetailPage } from '../event-detail/event-detail';
import { EventData } from '../../providers/event-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public eventList: any;
  public nextEvent: any = [];

  constructor(public nav: NavController, public eventData: EventData, public loadingCtrl: LoadingController) {

    // ----------------------------------------------------------------------------------------------
    // TODO : get the next event as part of getting all the events. This will save on Firebase calls.
    // ----------------------------------------------------------------------------------------------
    // console.log("Retrieving first event - started");
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
    });
    // console.log("Retrieving first event - complete");

    // console.log("Retrieving events list - started");
    this.eventData.getEventList().orderByChild('date').on('value', snapshot => {

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
    this.nav.push(EventCreatePage);
  }

}

