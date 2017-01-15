import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MapMarkerComponent } from '../../components/map-marker/map-marker';
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

  constructor(public viewCtrl: ViewController) {
    this.loadMap().subscribe((map) => {
      this.map = map;
    })
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
    let latLng = new google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng());
    // console.log(this.map.getCenter().lat());
    // console.log(this.map.getCenter().lng());
    this.viewCtrl.dismiss(latLng);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}