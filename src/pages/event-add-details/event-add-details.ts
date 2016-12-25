import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { ModalUserListPage } from '../modal-user-list/modal-user-list';
import { EventData } from '../../providers/event-data';

@Component({
  selector: 'page-event-add-details',
  templateUrl: 'event-add-details.html'
})
export class EventAddDetailsPage {

  public eventInfo: any;
  public groupImage250: any;
  public performer: any;
  public ticketFaceValue: any;
  public allUsers: any
  public currentUserID: any;
  public chosenUsers: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public modalCtrl: ModalController, public eventData: EventData, public toastCtrl: ToastController) {
    this.eventInfo = this.navParams.get('eventInfo')
    console.log(this.eventInfo);
    // get the performs image
    let imageObj = this.eventInfo.image;

    // TODO : get a 250x250 no-picture-available JPEG
    this.groupImage250 = "img/no-picture-available.jpg";
    if (imageObj != null) {
      this.groupImage250 = imageObj.block250.url;
    }

    let performerObj = this.eventInfo.performers
    if (performerObj != null) {
      this.performer = performerObj.performer.name;
    }

    this.ticketFaceValue = 0.00

    // -------------------------------------
    // TODO - show currently invited guests
    // -------------------------------------
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

  showUsersModal() {
    let usersModal = this.modalCtrl.create(ModalUserListPage);
    usersModal.onDidDismiss(data => {
      // clear the chosen users
      this.chosenUsers = [];

      // go through the returned user list and add ONLY the chosen user to the chosen user list
      data.forEach(user => {
        if (user.chosen) {
          this.chosenUsers.push(user);
        }
      })
    });
    // show the modal
    usersModal.present();
  }

  addEvent() {
    
    // check to see whether any guests have been invited.
    if (this.chosenUsers == null || this.chosenUsers.length === 0) {
      console.log("Billy no mates");
    } else {

      // --------------------------------------------------------------------
      // TODO : if could be the case there IS no ticket value i.e. a freebie
      // --------------------------------------------------------------------
      if (this.ticketFaceValue === 0) {
        let alert = this.alertCtrl.create({
          title: 'No Ticket Value',
          subTitle: "You've forgot to enter a ticket value.",
          buttons: ['OK']
        });
        alert.present();
      } else {
        this.eventData.createEvent(this.eventInfo, this.ticketFaceValue, this.chosenUsers).then(() => {
          this.navCtrl.pop();

          let toast = this.toastCtrl.create({
            message: 'Event was added successfully',
            duration: 2000
          });
          toast.present();
        });
      }
    }
  }

}
