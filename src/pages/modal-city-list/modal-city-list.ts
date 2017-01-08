import { Component, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'page-modal-city-list',
  templateUrl: 'modal-city-list.html'
})
export class ModalCityListPage {

  autocompleteItems: any;
  autocomplete: any;
  service: any;
  favouriteLocations: any;

  constructor(public viewCtrl: ViewController, private zone: NgZone, public storage: Storage) {
    this.service = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.storage.set('search_location', item);
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;

    // componentRestrictions: {country: 'TH'}
    this.service.getPlacePredictions({ input: this.autocomplete.query }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }

  setLocationAsFavourite(location) {
    // 1. get current favourites from local storage
    // 2. check whether passed location is already in the favourites, if it is then ignore
    // 3. add passed location to favourites 
    // 4. sort favourites  alphabetically
    // 5. save favourites to local storage

    console.log("setLocationAsFavourite: " + location);

    // 1. get current favourites from local storage
    this.storage.get('favourite_locations').then((data) => {
      this.favouriteLocations = (data != null && typeof (data) != 'undefine') ? data : [];
      console.log("this.favouriteLocations");
      console.log(this.favouriteLocations);

      // 2. check whether passed location is already in the favourites, if it is then ignore
      if (!this.alreadyAFavouiteLocation(location)) {

        // 3. add passed location to favourites 
        this.favouriteLocations.push({ location });

        // 4. sort favourites  alphabetically
        let orderedList = this.favouriteLocations.sort(this.sortByAlphabetically);
        // this.favouriteLocations = orderedList;

        // 5. save favourites to local storage
        this.storage.set('favourite_locations', orderedList);
      }

    });
  }

  alreadyAFavouiteLocation(location: string): boolean {
    // console.log("User ID: " + userId);

    let cntr = 0;
    let foundIt = false;

    // if (this.favouriteLocations != null && typeof (this.favouriteLocations) != 'undefined') {
    let favouriteLocationsListSize = this.favouriteLocations.length;

    while (cntr < favouriteLocationsListSize && !foundIt) {
      if (this.favouriteLocations[cntr].location === location) {
        // console.log("Returning TRUE");
        foundIt = true;
      }

      cntr++;
    }
    // }
    return foundIt;
  }

  sortByAlphabetically(a, b) {
    if (a.location < b.location)
      return -1;
    if (a.location > b.location)
      return 1;
    return 0;
  }


}
