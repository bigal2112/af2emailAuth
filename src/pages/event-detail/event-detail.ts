import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

// declare this variable so the typescript doesn't balk at EVDB
declare var EVDB: any;

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  eventId: any;
  loader: any;
  groupImages: any;
  performer: any;
  sliderOptions: any;
  imgCounter: number;

  eventVenueName: any;
  eventStartTime: any;
  eventVenueAddress: any;
  eventCity: any;
  eventTitle: any;

  constructor(public nav: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {

    this.sliderOptions = {
      pager: true
    };

    this.eventId = this.navParams.get('eventId');
    console.log("eventId:" + this.eventId);

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
      console.log(eventData);
      that.loader.dismiss();

      // if no results returned then inform user
      if (typeof (eventData) == 'undefined' || eventData == null) {
        console.log("SOME FUCKING WEIRD SHIT ERROR");
      } else {

        console.log("Event details retrieved");
        // so we've got the event details back
        // load them into the member variable to display on the html.

        // get the performs image
        let imagesObj = eventData.images;
        // that.groupImage250 = "img/no-picture-available.jpg";
        if (imagesObj != null) {
          let imageObj = imagesObj.image

          that.imgCounter = 0;
          that.groupImages = [];
          imageObj.forEach(element => {
            that.groupImages.push({
              // image: imageObj[that.imgCounter].medium.url
              image: imageObj[that.imgCounter].block188.url
            });

            that.imgCounter++;
          });

          console.log(that.groupImages);
        }

        let performerObj = eventData.performers
        if (performerObj != null) {
          that.performer = performerObj.performer.name;
        }
        console.log("Performer:" + that.performer);

        that.eventVenueName = eventData.venue_name;
        that.eventStartTime = eventData.start_time;
        that.eventVenueAddress = eventData.address;
        that.eventCity = eventData.city;
        that.eventTitle = eventData.title;

        // ------------------------------------------------
        // TODO : retrieve the event message board records
        // ------------------------------------------------
      }
    });
  }
}
