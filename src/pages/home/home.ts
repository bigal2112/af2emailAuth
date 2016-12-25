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
  public myEvents: any;
  public invitedEvents: any;
  // public myEventsRetrieved: boolean;
  // public invitedEventsRetrieved: boolean;

  public eventList: any = [];
  public unorderedList: any = [];
  public loader: any;
  public eventsCntr: number;
  public numberOfNotifications: number = 3;

  firstEventId: any;
  firstEventPerformer: any;
  firstEventTitle: any;
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

    // this.myEventsRetrieved = false;
    // this.invitedEventsRetrieved = false;

    // first get the events I've created
    this.eventData.getMyEvents().on('value', data => {
      this.myEvents = data;

      // next get the events I've been invited too
      this.eventData.getMyInvitedEvents().on('value', data => {
        this.invitedEvents = data;

        // now we have all the events we need to combien them into one array
        this.unorderedList = [];
        this.myEvents.forEach(snap => {
          this.unorderedList.push({
            key: snap.key,
            performer: snap.val().performer,
            title: snap.val().title,
            initialTicketPrice: snap.val().initialTicketPrice,
            start_time: snap.val().start_time,
            image250: snap.val().image250,
            imageMed: snap.val().imageMed
          });
        })

        this.invitedEvents.forEach(snap => {
          this.unorderedList.push({
            key: snap.key,
            performer: snap.val().performer,
            title: snap.val().title,
            initialTicketPrice: snap.val().initialTicketPrice,
            start_time: snap.val().start_time,
            image250: snap.val().image250,
            imageMed: snap.val().imageMed
          });
        })

        // sort the array by start_time
        let orderedList = this.unorderedList.sort(this.compare);

        // and remove any events that are in the past
        orderedList = orderedList.filter((event) => {
          return Date.parse(event.start_time) >= Date.now();
        })

        // now create the first itema dn eventsList from the sorted array
        this.eventList = [];
        this.eventsCntr = 0;
        orderedList.forEach(event => {

          if (this.eventsCntr === 0) {

            this.firstEventId = event.key;
            this.firstEventPerformer = event.performer;
            this.firstEventTitle = event.title;
            this.firstEventPrice = event.initialTicketPrice;
            this.firstEventDate = event.start_time;
            this.firstEventImage250 = event.image250;
            this.firstEventImageMed = event.imageMed;

          } else {
            this.eventList.push({
              id: event.key,
              performer: event.performer,
              title: event.title,
              initialTicketPrice: event.initialTicketPrice,
              start_time: event.start_time,
              image250: event.image250,
              imageMed: event.imageMed
            });
          }

          this.eventsCntr++;
        });
        // console.log("Retrieving events list - complete");
        this.loader.dismiss();

      });
    });

    // // get the returned events into an array
    // this.unorderedList = [];
    // snapshot.forEach(snap => {
    //   this.unorderedList.push({
    //     key: snap.key,
    //     performer: snap.val().performer,
    //     title: snap.val().title,
    //     initialTicketPrice: snap.val().initialTicketPrice,
    //     start_time: snap.val().start_time,
    //     image250: snap.val().image250,
    //     imageMed: snap.val().imageMed
    //   });
    // })

    // // sort the array by start_time
    // let orderedList = this.unorderedList.sort(this.compare);

    // // and remove any events that are in the past
    // orderedList = orderedList.filter((event) => {
    //   return Date.parse(event.start_time) >= Date.now();
    // })

    // // now create the first itema dn eventsList from the sorted array
    // this.eventList = [];
    // this.eventsCntr = 0;
    // orderedList.forEach(event => {

    //   if (this.eventsCntr === 0) {

    //     this.firstEventId = event.key;
    //     this.firstEventPerformer = event.performer;
    //     this.firstEventTitle = event.title;
    //     this.firstEventPrice = event.initialTicketPrice;
    //     this.firstEventDate = event.start_time;
    //     this.firstEventImage250 = event.image250;
    //     this.firstEventImageMed = event.imageMed;

    //   } else {
    //     this.eventList.push({
    //       id: event.key,
    //       performer: event.performer,
    //       title: event.title,
    //       initialTicketPrice: event.initialTicketPrice,
    //       start_time: event.start_time,
    //       image250: event.image250,
    //       imageMed: event.imageMed
    //     });
    //   }

    //   this.eventsCntr++;
    // });
    // // console.log("Retrieving events list - complete");
    // this.loader.dismiss();
    // console.log(this.nextEvent);
    // console.log(this.eventList);
  // });

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

showNotiications() {
  console.log("showNotifications");
}

compare(a, b) {
  if (a.start_time < b.start_time)
    return -1;
  if (a.start_time > b.start_time)
    return 1;
  return 0;
}

}

