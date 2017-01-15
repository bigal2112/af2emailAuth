import { Component } from '@angular/core';

/*
  Generated class for the MapMarker component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'map-marker',
  templateUrl: 'map-marker.html'
})
export class MapMarkerComponent {

  text: string;

  constructor() {
    console.log('Hello MapMarker Component');
    this.text = 'Hello World';
  }

}
