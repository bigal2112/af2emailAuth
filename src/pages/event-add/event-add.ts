import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { EventAddDetailsPage } from '../event-add-details/event-add-details';

// declare this variable so the typescript doesn't balk at EVDB
declare var EVDB: any;

@Component({
  selector: 'page-event-add',
  templateUrl: 'event-add.html'
})
export class EventAddPage {
  public searchString: String;
  public searchResults: any = [];
  public eventsList: any;
  public loader: any;
  public resultsCounter: number;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }

  ionViewDidLoad() {

  }

  searchForEvent() {
    
    if (typeof (this.searchString) == 'undefined' || this.searchString === null) {
      console.log("Place alert here");
    } else {
      // console.log("Search for:" + this.searchString);
      // they've entered a search criteria, let's see what it brings back.....

      var oArgs = {
        app_key: "n7XgQ8mk3VVsc6Qn",
        keywords: this.searchString,
        image_sizes: "block250,block188,medium",
        page_size: 100,
        location: "London, United Kingdom",
        within: "30",
        units: "mi",
        category: "music",
        date: "future",
        sort_order: "date"
      };

      // clear any previous results and initialise the results counter
      this.searchResults = [];
      this.resultsCounter = 0;

      // show loading control
      this.loader = this.loadingCtrl.create({
        content: "Searching for events...."
      });
      this.loader.present();

      // grab the current scope to use withing the EVDB callback
      let that = this;

      // ---------------------------------------------------------
      // TODO: put the call to EVDB into the event-data provider.
      // ---------------------------------------------------------

      // go get the results from Eventful
      EVDB.API.call("json/events/search", oArgs, function (oData) {
        console.log(oData.events);

        // if no results returned then inform user and clear any previous searchResults.
        if (typeof (oData.events) == 'undefined' || oData.events == null) {
          that.loader.dismiss();
          that.searchResults = [];

          console.log("ALERT - no results")
          let alert = that.alertCtrl.create({
            title: 'No events found',
            subTitle: 'Your search returned no results.',
            buttons: ['OK']
          });
          alert.present();

        } else {

          // so we've got some results back
          // initialise the search results array and grab the returned events
          let rawList = [];
          that.searchResults = [];
          that.eventsList = oData.events.event;

          // if only 1 event returned then simply grab the image and push the data into the rawList array
          if (oData.total_items == 1) {

            // get the performs image
            let imageObj = that.eventsList.image;

            let imageUrl = "img/no-picture-available.jpg";
            if (imageObj != null) {
              imageUrl = imageObj.medium.url;
            }

            // and push the 1 result to the rawList array
            rawList.push({
              id: that.eventsList.id,
              resultCounter: that.resultsCounter,
              venue_name: that.eventsList.venue_name,
              start_time: that.eventsList.start_time,
              venue_address: that.eventsList.venue_address,
              city_name: that.eventsList.city_name,
              title: that.eventsList.title,
              image: imageUrl
            });

          } else {

            // otherwise we have more than 1 result so loop through them pushing to the searchResults array as we go
            that.eventsList.forEach(event => {

              // get the performers image
              let imageObj = event.image;

              let imageUrl = "img/no-picture-available.jpg";
              if (imageObj != null) {
                imageUrl = imageObj.medium.url;
              }

              // and push the results to the rawList array
              rawList.push({
                id: event.id,
                resultCounter: that.resultsCounter,
                venue_name: event.venue_name,
                start_time: event.start_time,
                venue_address: event.venue_address,
                city_name: event.city_name,
                title: event.title,
                image: imageUrl
              });

              // increment the results counter
              that.resultsCounter++;
            });
          }

          // finally put the data into the searchResults array and remove the loader
          that.searchResults = rawList;
          console.log(that.searchResults);
          that.loader.dismiss();
        }
      });

    }
  }

  showEventDetails(resultIndex) {
    // if there were more than 1 event then use the index of the chosen result to send just the 1 event
    if (this.resultsCounter > 1) {
      this.navCtrl.push(EventAddDetailsPage, {
        eventInfo: this.eventsList[resultIndex]
      });
    } else {
      this.navCtrl.push(EventAddDetailsPage, {
        eventInfo: this.eventsList
      });
    }
  }

}
