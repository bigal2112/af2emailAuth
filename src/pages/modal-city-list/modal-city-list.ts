import { Component, NgZone } from '@angular/core';
import { ViewController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-modal-city-list',
  templateUrl: 'modal-city-list.html'
})
export class ModalCityListPage {

  autocompleteItems: any;
  autocomplete: any;
  service: any;

  constructor(public viewCtrl: ViewController, private zone: NgZone) {
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

}
