import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-modal-favourite-locations',
  templateUrl: 'modal-favourite-locations.html'
})
export class ModalFavouriteLocationsPage {

  public favouriteLocations: any;

  constructor(public viewCtrl: ViewController, public storage: Storage) {
    this.storage.get('favourite_locations').then((data) => {
      this.favouriteLocations = (data != null && typeof (data) != 'undefine') ? data : [];
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseLocation(item: any) {
    this.storage.set('search_location', item);
    this.viewCtrl.dismiss(item);
  }

  removeFromFavourites(index) {
    console.log("removeFromFavourites: " + index);
    this.favouriteLocations.splice(index, 1);
    this.storage.set('favourite_locations', this.favouriteLocations);  
  }

}
