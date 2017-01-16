import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-modal-favourite-venues',
  templateUrl: 'modal-favourite-venues.html'
})
export class ModalFavouriteVenuesPage {

  public favouriteVenues: any;

  constructor(public viewCtrl: ViewController, public storage: Storage) {
    this.storage.get('favourite_venues').then((data) => {
      this.favouriteVenues = (data != null && typeof (data) != 'undefine') ? data : [];
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseVenue(item: any) {
    // this.storage.set('search_location', item);
    console.log(item)
    this.viewCtrl.dismiss(item);
  }

  removeFromFavourites(index) {
    console.log("removeFromFavourites: " + index);
    this.favouriteVenues.splice(index, 1);
    this.storage.set('favourite_venues', this.favouriteVenues);  
  }

}
