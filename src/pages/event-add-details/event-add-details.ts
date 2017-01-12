import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { ModalUserListPage } from '../modal-user-list/modal-user-list';
import { ModalGetTicketDetailsPage } from '../modal-get-ticket-details/modal-get-ticket-details';
import { EventData } from '../../providers/event-data';
import { GlobalVariables } from '../../providers/global-variables';

@Component({
  selector: 'page-event-add-details',
  templateUrl: 'event-add-details.html'
})
export class EventAddDetailsPage {

  public eventInfo: any;
  public groupImage250: any;
  public performer: any;
  public ticketFaceValue: any;
  public ticketDeadline: any;
  public allUsers: any
  public currentUserID: any;
  public chosenUsers: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public popoverCtrl: PopoverController, public eventData: EventData, public toastCtrl: ToastController, public globalVars: GlobalVariables) {
    this.eventInfo = this.navParams.get('eventInfo')
    // console.log(this.eventInfo);

    // clear out the guest list to start with
    this.globalVars.setGuestList([]);

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

    this.ticketFaceValue = null;
    this.ticketDeadline = null;

    // -----------------------------------------------------------------------
    // TODO - show currently invited guests avatars (like event details page)
    // -----------------------------------------------------------------------
  }

  editTicketDetails() {
    let popover = this.popoverCtrl.create(ModalGetTicketDetailsPage, {ticketFacevalue: this.ticketFaceValue, ticketDeadline: this.ticketDeadline});
    popover.onDidDismiss((data) => {
      if (data != null && typeof (data) != 'undefined') {
        // user has updated the values
        this.ticketFaceValue = data.returnData[0].ticketFacevalue;
        this.ticketDeadline = data.returnData[0].ticketDeadline;
      }
    });
    // show the modal
    popover.present();
  }

  showUsersModal() {
    let popover = this.popoverCtrl.create(ModalUserListPage);
    popover.onDidDismiss(() => {
      // clear the chosen users
      this.chosenUsers = [];

      // go through the returned user list and add ONLY the chosen user to the chosen user list
      this.globalVars.getGuestList().forEach(user => {
        if (user.chosen) {
          this.chosenUsers.push(user);
        }
      })
    });
    // show the modal
    popover.present();
  }

  addEvent() {

    // check to see whether any guests have been invited.
    if (this.chosenUsers == null || this.chosenUsers.length === 0) {
      let confirm = this.alertCtrl.create({
        title: 'No guests chosen?',
        message: "You haven't chosen any guests for this event. Do you still want to add it?",
        buttons: [
          {
            text: 'No',
            handler: () => {
              console.log("I've got some friends, honest!!!")
            }
          },
          {
            text: 'Yes',
            handler: () => {
              // --------------------------------------------------------------------
              // TODO : it could be the case there IS no ticket value i.e. a freebie
              // --------------------------------------------------------------------
              if (this.ticketFaceValue === 0) {
                let alert = this.alertCtrl.create({
                  title: 'No Ticket Value',
                  subTitle: "You've forgot to enter a ticket value.",
                  buttons: ['OK']
                });
                alert.present();
              } else {
                this.createEvent();
              }
            }
          }
        ]
      });
      confirm.present();
    } else {

      // --------------------------------------------------------------------
      // TODO : it could be the case there IS no ticket value i.e. a freebie
      // --------------------------------------------------------------------
      if (this.ticketFaceValue === 0) {
        let alert = this.alertCtrl.create({
          title: 'No Ticket Value',
          subTitle: "You've forgot to enter a ticket value.",
          buttons: ['OK']
        });
        alert.present();
      } else {
        this.createEvent();
      }
    }
  }

  createEvent() {
    this.eventData.createEvent(this.eventInfo, this.ticketFaceValue, new Date(this.ticketDeadline).getTime(), this.chosenUsers).then(() => {
      this.navCtrl.pop();

      let toast = this.toastCtrl.create({
        message: 'Event was added successfully',
        duration: 2000
      });
      toast.present();
    });
  }

}
