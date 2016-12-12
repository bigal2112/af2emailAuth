import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventData } from '../../providers/event-data';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html',
})
export class EventDetailPage {
  currentEvent: any;
  guestName: string;
  guestPicture: any;
  guestList: any;

  constructor(public nav: NavController, public navParams: NavParams, public eventData: EventData) {

    this.eventData.getEventDetail(this.navParams.get('eventId'))
      .on('value', (snapshot) => {
        this.currentEvent = snapshot.val();
      });

    this.eventData.getGuestList(this.navParams.get('eventId'))
    .on('value', snapshot => {
      let rawList = [];
      snapshot.forEach(snap => {
        rawList.push({
          id: snap.key,
          guestName: snap.val().guestName
        });
      });
      this.guestList = rawList;
    });
  }

  addGuest(guestName) {
    // console.log(guestName);
    // console.log(this.currentEvent.id);
    // console.log(this.currentEvent.price);

    this.eventData.addGuest(guestName, this.currentEvent.id, this.currentEvent.price, this.guestPicture).then(() => {
      this.guestName = '';
      this.guestPicture = null;
    });
  }

  takePicture() {
    Camera.getPicture({
      quality: 95,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.guestPicture = imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
}