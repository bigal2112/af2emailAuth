import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';
import { GlobalVariables } from '../../providers/global-variables';

// declare this variable so the typescript doesn't balk at EVDB
declare var EVDB: any;

@Component({
  selector: 'page-event-detail-information',
  templateUrl: 'event-detail-information.html'
})
export class EventDetailInformationPage {

  eventId: any;
  firebaseEventId: any;
  loader: any;
  groupImages: any;
  performer: any;
  sliderOptions: any;
  imgCounter: number;

  eventVenueName: any;
  eventStartTime: any;
  eventVenueAddress: any;
  eventCity: any;
  eventCountry: any;
  eventTitle: any;

  invitedUsers: any;

  eventType: string;    // "MY_EVENT" or "INVITED_TO_EVENT"

  constructor(public nav: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public eventData: EventData, public globalVars: GlobalVariables) {

    this.sliderOptions = {
      pager: true
    };

    this.eventId = this.globalVars.getEventfulEventId();
    this.firebaseEventId = this.globalVars.getFirebaseEventId();
    this.eventType = this.globalVars.getEventType();

    // console.log("eventId:" + this.eventId);
    // console.log("firebaseEventId:" + this.firebaseEventId);

    // console.log("Search for:" + this.searchString);
    // they've entered a search criteria, let's see what it brings back.....

    var oArgs = {
      app_key: "n7XgQ8mk3VVsc6Qn",
      id: this.eventId,
      image_sizes: "block250,block188,medium",
    };

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving event details...."
    });
    this.loader.present();

    // grab the current scope to use withing the EVDB callback
    let that = this;

    // ---------------------------------------------------------
    // TODO: put the call to EVDB into the event-data provider.
    // ---------------------------------------------------------

    // go get the results from Eventful
    EVDB.API.call("json/events/get", oArgs, function (eventData) {
      // console.log(eventData);
      that.loader.dismiss();

      // if no results returned then inform user
      if (typeof (eventData) == 'undefined' || eventData == null) {
        console.log("SOME FUCKING WEIRD SHIT ERROR");
      } else {

        // so we've got the event details back
        // load them into the member variable to display on the html.

        // get the performs image
        let imagesObj = eventData.images;

        that.groupImages = [];

        if (imagesObj != null) {
          let imageObj = imagesObj.image
          that.imgCounter = 0;

          // 1 image         : push the 1 image to the array
          // loads of images : push all of them to the array
          if (typeof (imageObj.length) === 'undefined') {
            that.groupImages.push({
              image: imageObj.block188.url
            });
          } else {
            imageObj.forEach(element => {
              that.groupImages.push({
                image: imageObj[that.imgCounter].block188.url
              });

              that.imgCounter++;
            });

          }
        } else {
          // there are no images so push the default to the array
          that.groupImages.push({
            image: "img/no-picture-available.jpg"
          });
        }

        let performerObj = eventData.performers
        if (performerObj != null) {
          that.performer = performerObj.performer.name;
        }

        that.eventVenueName = eventData.venue_name;
        that.eventStartTime = eventData.start_time;
        that.eventVenueAddress = eventData.address;
        that.eventCity = eventData.city;
        that.eventTitle = eventData.title;
        that.eventCountry = eventData.country
      }
    });


    // now get the invited users
    this.eventData.getInvitedUsers(this.firebaseEventId).on('value', data => {
      if (data == null || typeof (data) == 'undefined') {
        console.log("NO INVITES");
      } else {

        this.invitedUsers = [];
        data.forEach(invitedUser => {
          this.invitedUsers.push({
            imageMed: invitedUser.val().imageMed,
            inviteAccepted: invitedUser.val().inviteAccepted,
            inviteeAvatarURL: invitedUser.val().inviteeAvatarURL,
            inviteeName: invitedUser.val().inviteeName            
          });
        });

        console.log(this.invitedUsers);
      }
    })
  }

}
