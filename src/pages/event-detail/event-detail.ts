import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';

// declare this variable so the typescript doesn't balk at EVDB
declare var EVDB: any;

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
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

  eventMessages: any;

  constructor(public nav: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public eventData: EventData) {
    this.eventMessages = [];

    this.sliderOptions = {
      pager: true
    };

    this.eventId = this.navParams.get('eventId');
    this.firebaseEventId = this.navParams.get('firebaseEventId');
    console.log("eventId:" + this.eventId);
    console.log("firebaseEventId:" + this.firebaseEventId);

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
        // that.groupImage250 = "img/no-picture-available.jpg";
        that.groupImages = [];

        if (imagesObj != null) {
          let imageObj = imagesObj.image
          // console.log(imageObj);
          // console.log("Length:" + imageObj.length);
          that.imgCounter = 0;

          // 1 image         : push the 1 image to the array
          // loads of images : push all if them to the array
          if (typeof(imageObj.length) === 'undefined') {
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

            // console.log(that.groupImages);
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

        // ------------------------------------------------
        // TODO : retrieve the event message board records
        // ------------------------------------------------
        that.eventData.getEventMessages(that.firebaseEventId).on('value', data => {
          console.log(data);
          
          data.forEach(snap => {
          that.eventMessages.push({
            ownerId: snap.val().ownerId,
            ownerUsername: snap.val().ownerUsername,
            createdOn: snap.val().messageCreatedOn,
            body: snap.val().messageBody
          });
        })
        });
      }
    });
  }
}
