import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-modal-get-venue-details',
  templateUrl: 'modal-get-venue-details.html'
})
export class ModalGetVenueDetailsPage {

  public passedAddress: string;
  public venueAddress: any;
  favouriteVenues: any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public storage: Storage) {
    // get the passed address
    this.passedAddress = this.navParams.get("address");

    // split it by the commas
    console.log("Venue address: " + this.passedAddress);
    let addressArray = this.passedAddress.split(',')
    console.log(addressArray);

    // create the venueAddress array
    this.venueAddress = [];
    this.venueAddress["name"] = "";
    this.venueAddress["favourite"] = false;
    let addrCntr = 1
    addressArray.forEach(addressLine => {
      if (addrCntr === 1) {
        this.venueAddress["addr1"] = addressLine.trim();
      } else if (addrCntr === 2) {
        this.venueAddress["addr2"] = addressLine.trim();
      } else if (addrCntr === 3) {
        this.venueAddress["addr3"] = addressLine.trim();
      } else if (addrCntr === 4) {
        this.venueAddress["addr4"] = addressLine.trim();
      } else if (addrCntr >= 5) {
        this.venueAddress["addr5"] += addressLine.trim();
      }

      addrCntr++;
    });
  }

  ionViewDidLoad() {
    console.log('Hello ModalGetVenueDetailsPage Page');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  addVenue() {
    // add this venue to the favourites list if needs be
    if (this.venueAddress["favourite"]) {
      let that = this;
      // get the favourite venues from storage
      this.storage.get('favourite_venues').then((data) => {
        that.favouriteVenues = (data != null && typeof (data) != 'undefine') ? data : [];

       //  add venue to favouriteVenues 
        that.favouriteVenues.push(that.venueAddress);

        // sort favourites alphabetically
        let orderedList = that.favouriteVenues.sort(that.sortByAlphabetically);

        // save favourites to local storage
        that.storage.set('favourite_venues', orderedList);
      });
    }
    this.viewCtrl.dismiss(this.venueAddress);
  }


  toggleFavourite() {
    this.venueAddress["favourite"] = !this.venueAddress["favourite"];
  }

  sortByAlphabetically(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

}
