import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import firebase from 'firebase';

@Component({
  selector: 'page-event-add-details',
  templateUrl: 'event-add-details.html'
})
export class EventAddDetailsPage {

  public eventInfo: any;
  public groupImage: any;
  public performer: any;
  public ticketFaceValue: any;
  public allUsers: any
  public currentUserID: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public userData: UserData) {
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

    // get the current users ID for use in the next bit
    this.currentUserID = firebase.auth().currentUser.uid;

    // get all the users 
    //
    // TODO : change this to show only those in the current users group.
    // TODO : add a way of knowing whether the user has already been invited
    this.userData.getAllUsers().on('value', (snapshot) => {

      let rawList = [];
      snapshot.forEach(snap => {

        // if the ID is the same as the current users ID then ignore, otherwise proceed
        if (this.currentUserID != snap.key) {
          rawList.push({
            id: snap.key,
            username: snap.val().username,
            avatarURL: snap.val().avatarURL
          });
        }
      });
      this.allUsers = rawList;
    });
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
