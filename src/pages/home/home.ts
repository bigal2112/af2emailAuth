import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { EventSearchPage } from '../event-search/event-search';
import { EventDetailTabsPage } from '../event-detail-tabs/event-detail-tabs';
import { EventData } from '../../providers/event-data';
import { GlobalVariables } from '../../providers/global-variables';

// declare this variable so the typescript doesn't balk at google
declare var EVDB: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public myEvents: any;
  public invitedEvents: any;
  
  public eventList: any;
  public myEventsList: any;
  public invitedEventsList: any;
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
  firstEventActualPrice: any;
  firstEventDate: any;
  firstEventImage250: any;
  firstEventImageMed: any;
  firstEventNumberOfInvites: any;
  firstEventFirebaseInviteId: any;
  firstEventInviteAcceptedStatus: any;
  firstEventBackgroundColor: string;

  that: any;

  constructor(public nav: NavController, public eventData: EventData, public globalVars: GlobalVariables, public loadingCtrl: LoadingController) {

    // initialise the current users global details
    this.globalVars.setCurrentUserDetals();

    this.numberOfInvitations = 0;

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving your events...."
    });
    this.loader.present();

    // this.that = this;

    // this.myEventsRetrieved = false;
    // this.invitedEventsRetrieved = false;

    // first get the events I've created
    this.eventData.getMyEvents().on('value', data => {
      this.myEvents = data;

      // next get the events I've been invited too
      this.eventData.getMyInvitedEvents().on('value', data => {
        this.invitedEvents = data;

        // now we have all the events we need to combine them into one array
        this.myEventsList = [];
        this.myEvents.forEach(snap => {
          this.myEventsList.push({
            eventfulId: snap.val().eventId,
            eventType: "MY_EVENT",
            firebaseEventId: snap.key,
            performer: snap.val().performer,
            title: snap.val().title,
            initialTicketPrice: snap.val().initialTicketPrice,
            actualTicketPrice: snap.val().actualTicketPrice,
            start_time: snap.val().start_time,
            image250: snap.val().image250,
            imageMed: snap.val().imageMed,
            numberOfInvites: snap.val().numberOfInvites,
            firebaseInviteId: null,
            inviteAcceptedStatus: null
          });
        })

        // console.log("myEvents");
        // console.log(this.unorderedList);

        this.invitedEventsList = [];
        this.numberOfInvitations = 0;
        this.invitedEvents.forEach(snap => {

          this.numberOfInvitations++;

          this.invitedEventsList.push({
            eventfulId: snap.val().eventId,
            eventType: "INVITED_TO_EVENT",
            firebaseEventId: snap.val().firebaseEventId,
            performer: snap.val().performer,
            title: snap.val().title,
            initialTicketPrice: snap.val().initialTicketPrice,
            actualTicketPrice: snap.val().actualTicketPrice,
            start_time: snap.val().start_time,
            image250: snap.val().image250,
            imageMed: snap.val().imageMed,
            numberOfInvites: 0,
            firebaseInviteId: snap.key,
            inviteAcceptedStatus: snap.val().inviteAccepted
          });
        });

        // remove any invited to events where the tickets have already been bought
        this.invitedEventsList = this.invitedEventsList.filter((event) => {
          return event.actualTicketPrice == null || event.actualTicketPrice == 0.00;
        })

        // console.log("and invitedEvents");
        // console.log(this.unorderedList);

        // concatenate both my events and invited event together and sort by start date
        let unorderedList = this.myEventsList.concat(this.invitedEventsList);
        let orderedList = unorderedList.sort(this.sortByStartTimeDesc);

        // remove any events that are in the past
        orderedList = orderedList.filter((event) => {
          return Date.parse(event.start_time) >= Date.now();
        })


        // now create the first item and eventList from the sorted array
        this.eventList = [];
        this.eventsCntr = 0;
        orderedList.forEach(event => {

          // work out the list items background color base on the inviteAccepted value
          let backgroundColor = "white";
          if(event.inviteAcceptedStatus === "TRACK") {
            backgroundColor = "lightcyan";
          } else if(event.inviteAcceptedStatus === "REJECT") {
            backgroundColor = "lightcoral";
          } else if(event.inviteAcceptedStatus === "NOT YET") {
            backgroundColor = "lightgoldenrodyellow";
          }

          if (this.eventsCntr === 0) {
            this.firstEventEventfulId = event.eventfulId;
            this.firstEventType = event.eventType;
            this.firstEventFirebaseEventId = event.firebaseEventId;
            this.firstEventPerformer = event.performer;
            this.firstEventTitle = event.title;
            this.firstEventPrice = event.initialTicketPrice;
            this.firstEventActualPrice = event.actualTicketPrice;
            this.firstEventDate = event.start_time;
            this.firstEventImage250 = event.image250;
            this.firstEventImageMed = event.imageMed;
            this.firstEventNumberOfInvites = event.numberOfInvites;
            this.firstEventFirebaseInviteId = event.firebaseInviteId;
            this.firstEventInviteAcceptedStatus = event.inviteAcceptedStatus;
            this.firstEventBackgroundColor = backgroundColor;
          } else {
            this.eventList.push({
              eventfulId: event.eventfulId,
              eventType: event.eventType,
              firebaseEventId: event.firebaseEventId,
              performer: event.performer,
              title: event.title,
              initialTicketPrice: event.initialTicketPrice,
              actualTicketPrice: event.actualTicketPrice,
              start_time: event.start_time,
              image250: event.image250,
              imageMed: event.imageMed,
              numberOfInvites: event.numberOfInvites,
              firebaseInviteId: event.firebaseInviteId,
              inviteAcceptedStatus: event.inviteAcceptedStatus,
              backgroundColor: backgroundColor
            });
          }

          this.eventsCntr++;
        });
        // console.log("Retrieving events list - complete");
        // console.log(this.eventList);
        this.loader.dismiss();

      });
    });
  }

  goToEventDetail(eventId, firebaseEventId, performer, eventType, firebaseInviteId) {
    // use the Global variables to store the Evenful and the Firebase event ID's 
    // so they are accessible to the TAB pages.
    this.globalVars.setEventIds(eventId, firebaseEventId, firebaseInviteId);
    this.globalVars.setEventType(eventType);
    this.nav.push(EventDetailTabsPage, {
      performer: performer
    });
  }

  goToProfile() {
    this.nav.push(ProfilePage);
  }

  eventSearch() {
    this.nav.push(EventSearchPage);
  }

  showNotiications() {
    console.log("showNotifications");
  }

  sortByStartTimeDesc(a, b) {
    if (a.start_time < b.start_time)
      return -1;
    if (a.start_time > b.start_time)
      return 1;
    return 0;
  }

}

