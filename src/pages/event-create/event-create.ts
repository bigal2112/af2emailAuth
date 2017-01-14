import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';

@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {
  eventInitialPrice: number;
  eventDeadline: any;
  formData: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public eventData: EventData) {
    this.formData = [];
    this.eventInitialPrice = 0;
    this.eventDeadline = new Date().toISOString();
  }

  createEvent() {
    // console.log(this.formData.performers);
    // console.log(this.eventInitialPrice);
    // console.log(this.eventDeadline);

    this.eventData.createEvent(this.formData, this.eventInitialPrice, new Date(this.eventDeadline).getTime(), null, true)
      .then(() => {
        this.navCtrl.pop();

        let toast = this.toastCtrl.create({
          message: 'Event was added successfully',
          duration: 2000
        });
        toast.present();
      });
  }
}