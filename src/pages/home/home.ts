import { Component } from '@angular/core';
import { NavController, LoadingController  } from 'ionic-angular';

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

  constructor(public nav: NavController, public eventData: EventData, public loadingCtrl: LoadingController) {
    this.getEventList();
  }

  getEventList() {

    console.log("Retrieving events data - started");
    // let loader = this.loadingCtrl.create({
    //   content: "Retrieving events...."
    // });
    // loader.present();
  
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
      console.log("Retrieving events data - complete");

      // loader.dismiss();
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

