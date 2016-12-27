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
  public numberOfInvitations: number;

  firstEventEventfulId: any;
  firstEventType: any;
  firstEventId: any;
  firstEventFirebaseEventId: any;
  firstEventPerformer: any;
  firstEventTitle: any;
  firstEventPrice: any;
  firstEventDate: any;
  firstEventImage250: any;
  firstEventImageMed: any;
  firstEventNumberOfInvites: any;

  constructor(public nav: NavController, public eventData: EventData, public loadingCtrl: LoadingController) {
    this.numberOfInvitations = 0;

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
        
        // now we have all the events we need to combine them into one array
        this.unorderedList = [];
        this.myEvents.forEach(snap => {
          this.unorderedList.push({
            eventfulId: snap.val().eventId,
            type: "MYEVENTS",
            firebaseEventId: snap.key,
            performer: snap.val().performer,
            title: snap.val().title,
            initialTicketPrice: snap.val().initialTicketPrice,
            start_time: snap.val().start_time,
            image250: snap.val().image250,
            imageMed: snap.val().imageMed,
            numberOfInvites: snap.val().numberOfInvites
          });
        })

        console.log("myEvents");
        console.log(this.unorderedList);

        this.numberOfInvitations = 0;
        this.invitedEvents.forEach(snap => {
          this.numberOfInvitations++;

          this.unorderedList.push({
            eventfulId: snap.val().eventId,
            type: "INVITES",
            firebaseEventId: snap.key,
            performer: snap.val().performer,
            title: snap.val().title,
            initialTicketPrice: snap.val().initialTicketPrice,
            start_time: snap.val().start_time,
            image250: snap.val().image250,
            imageMed: snap.val().imageMed,
            numberOfInvites: 0
          });
        })

        console.log("and invitedEvents");
        console.log(this.unorderedList);

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
            this.firstEventEventfulId = event.eventfulId,
            this.firstEventType = event.type;
            this.firstEventFirebaseEventId = event.firebaseEventId;
            this.firstEventPerformer = event.performer;
            this.firstEventTitle = event.title;
            this.firstEventPrice = event.initialTicketPrice;
            this.firstEventDate = event.start_time;
            this.firstEventImage250 = event.image250;
            this.firstEventImageMed = event.imageMed;
            this.firstEventNumberOfInvites = event.numberOfInvites;
          } else {
            this.eventList.push({
              eventfulId: event.eventfulId,
              type: event.type,
              firebaseEventId: event.firebaseEventId,
              performer: event.performer,
              title: event.title,
              initialTicketPrice: event.initialTicketPrice,
              start_time: event.start_time,
              image250: event.image250,
              imageMed: event.imageMed,
              numberOfInvites: event.numberOfInvites
            });
          }

          this.eventsCntr++;
        });
        console.log("Retrieving events list - complete");
        console.log(this.eventList);
        this.loader.dismiss();

      });
    });
  }

  goToEventDetail(eventId, firebaseEventId) {
    this.nav.push(EventDetailPage, {
      eventId: eventId,
      firebaseEventId: firebaseEventId
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

