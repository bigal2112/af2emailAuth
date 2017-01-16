import { Component } from '@angular/core';
import { ViewController, PopoverController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { ModalGetVenueDetailsPage } from '../modal-get-venue-details/modal-get-venue-details';
// import { MapMarkerComponent } from '../../components/map-marker/map-marker';
import { Observable } from 'rxjs/Observable';

declare var google;

@Component({
  selector: 'page-modal-get-location-from-map',
  templateUrl: 'modal-get-location-from-map.html'
})
export class ModalGetLocationFromMapPage {

  // @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public marker: any;
  public isMapIdle: boolean;
  public locationSearch: string;
  public searchResults: Array<any>;
  geocoder: any;

  constructor(public viewCtrl: ViewController, public popoverCtrl: PopoverController) {
    this.loadMap().subscribe((map) => {
      this.map = map;
    });

    this.geocoder = new google.maps.Geocoder();
  }

  loadMap(): Observable<any> {

    let locationObs = Observable.create(observable => {
      Geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        }

        let mapElement = document.getElementById('map');
        let map = new google.maps.Map(mapElement, mapOptions);

        observable.next(map);

      }, (err) => {
        console.log(err);
      });
    });

    return locationObs;

  }

  returnLocation() {
    let returnData = [];
    // returnData["latitude"] = this.map.getCenter().lat();
    // returnData["longitude"] = this.map.getCenter().lng();

    // this.viewCtrl.dismiss(returnData);

    let latLng = new google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng());
    let that = this;
    this.geocoder.geocode({ 'location': latLng }, function (results, status) {
      if (status === 'OK') {
        console.log(results);
        if (results[0]) {

          // open the get venue data popover
          let popover = that.popoverCtrl.create(ModalGetVenueDetailsPage, { "address": results[0].formatted_address });
          popover.onDidDismiss((returnData) => {
            // if the user has clicked on Add Venue
            if (returnData != null) {
              // add the LatLng to the returnData array
              returnData["latitude"] = that.map.getCenter().lat();
              returnData["longitude"] = that.map.getCenter().lng();
              // and close the map
              that.viewCtrl.dismiss(returnData);
            }
          });
          // show the modal
          popover.present();


        } else {
          window.alert('No results found');
          that.viewCtrl.dismiss();
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
        that.viewCtrl.dismiss();
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // searchForLocation() {
  //   this.searchResults = [];

  //   this.geocoder.geocode({ 'address': this.locationSearch }, function (results, status) {
  //     if (status == 'OK') {
  //       this.searchResults = results.slice(0, 10);
  //       console.log(this.searchResults);

  //     } else {
  //       alert('Geocode was not successful for the following reason: ' + status);
  //     }
  //   });
  // }

}