import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

/*
  Generated class for the EventAddDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-add-details',
  templateUrl: 'event-add-details.html'
})
export class EventAddDetailsPage {

  public eventInfo: any;
  public groupImage: any;
  public performer: any;
  public ticketFaceValue: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.eventInfo = this.navParams.get('eventInfo')
    console.log(this.eventInfo);
    // get the performs image
    let imageObj = this.eventInfo.image;

    this.groupImage = "img/no-picture-available.jpg";
    if (imageObj != null) {
      this.groupImage = imageObj.block250.url;
    }

    let performerObj = this.eventInfo.performers
    if (performerObj != null) {
      this.performer = performerObj.performer.name;
    }

    this.ticketFaceValue = 0.00

  }

  editTicketFaceValue() {
    let prompt = this.alertCtrl.create({
      title: 'Ticket Face Value',
      message: "Enter the face value of 1 ticket for the event.",
      inputs: [
        {
          name: 'value',
          placeholder: 'Value',
          value: this.ticketFaceValue
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            this.ticketFaceValue = data.value;
          }
        }
      ]
    });
    prompt.present();

  }

  addEvent() {
    console.log("addEvent");

    // ---------------------------------------------
    // TODO : ensure there is a valid ticket costs
    // ---------------------------------------------

  }

}
