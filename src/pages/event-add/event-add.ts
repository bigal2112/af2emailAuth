import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

// declare this variable so the typescript doesn't balk at EVDB
declare var EVDB: any;

@Component({
  selector: 'page-event-add',
  templateUrl: 'event-add.html'
})
export class EventAddPage {
  public searchString: String;
  public searchResults: any = [];
  public loader: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) { }

  ionViewDidLoad() {
    console.log('Hello EventAddPage Page');
  }

  searchForEvent() {
    if (typeof (this.searchString) == 'undefined' || this.searchString === null) {
      console.log("Place alert here");
    } else {
      console.log("Search for:" + this.searchString);
      // they've entered a search criteria, let's see what it brings back.....

      var oArgs = {
        app_key: "n7XgQ8mk3VVsc6Qn",
        keywords: this.searchString,
        page_size: 100,
        location: "London, United Kingdom",
        within: "20",
        units: "mi",
        category: "music",
        date: "future",
        sort_order: "date"
      };

      // show loading control
      this.loader = this.loadingCtrl.create({
        // content: "Retrieving events...."
      });
      this.loader.present();

      let that = this;

      EVDB.API.call("json/events/search", oArgs, function (oData) {
        // console.log(oData);

        if (typeof (oData.events) == 'undefined' || oData.events == null) {
          console.log("ALERT - no reults")
          that.loader.dismiss();
        } else {

          let rawList = [];
          that.searchResults = [];

          // ----------------------------------------------------------------
          // TODO : if only 1 result is returned then the forEach falls over.
          // ----------------------------------------------------------------
          // let eventsObj = oData.events
          console.log("Total Items:" + oData.total_items);

          if (oData.total_items == 1) {

            let event = oData.events.event;

            // remove any results where Performs is empty 
            // if (event.performers != null) {

              let imageObj = event.image;

              let imageUrl = "img/no-picture-available.jpg";
              if (imageObj != null) {
                imageUrl = imageObj.medium.url;
              }
              
              rawList.push({
                id: event.id,
                venue_name: event.venue_name,
                start_time: event.start_time,
                venue_address: event.venue_address,
                city_name: event.city_name,
                title: event.title,
                image: imageUrl
              });
            // }
          } else {

            oData.events.event.forEach(event => {

              // remove any results where Performs is empty 
              // if (event.performers != null) {

                let imageObj = event.image;

                let imageUrl = "img/no-picture-available.jpg";
                if (imageObj != null) {
                  imageUrl = imageObj.medium.url;
                }
                // console.log(imageUrl);

                rawList.push({
                  id: event.id,
                  venue_name: event.venue_name,
                  start_time: event.start_time,
                  venue_address: event.venue_address,
                  city_name: event.city_name,
                  title: event.title,
                  image: imageUrl
                });
              // }
            });
          }

          that.searchResults = rawList;
          // console.log(that.searchResults);
          that.loader.dismiss();
        }
      });

    }
  }

}
