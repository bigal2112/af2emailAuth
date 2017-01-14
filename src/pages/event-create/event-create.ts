import { Component } from '@angular/core';
import { NavController, ToastController, PopoverController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';
import { InAppBrowser, DatePicker } from 'ionic-native';
import { ModalUserListPage } from '../modal-user-list/modal-user-list';
import { GlobalVariables } from '../../providers/global-variables';

@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {
  eventInitialPrice: number;
  eventDeadline: any;
  formData: any;
  public chosenUsers: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public eventData: EventData, public popoverCtrl: PopoverController, public globalVars: GlobalVariables) {
    this.formData = [];
    // this.eventInitialPrice = 0;
    // this.eventDeadline = new Date().toISOString();

    // clear out the guest list to start with
    this.globalVars.setGuestList([]);
    this.chosenUsers = [];
  }

  createEvent() {
    // console.log(this.formData.performers);
    // console.log(this.eventInitialPrice);
    // console.log(this.eventDeadline);

    this.eventData.createEvent(this.formData, this.eventInitialPrice, new Date(this.eventDeadline).getTime(), this.chosenUsers, true)
      .then(() => {
        this.navCtrl.pop();

        let toast = this.toastCtrl.create({
          message: 'Event was added successfully',
          duration: 2000
        });
        toast.present();
      });
  }

  openBrowser() {
    let browser = new InAppBrowser("http://www.google.co.uk", "_system");
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
      });
      console.log(this.chosenUsers);
    });
    // show the modal
    popover.present();
  }

  // openStartDatePicker() {
  //   DatePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     minDate: new Date()
  //   }).then(
  //     date => this.formData.start_date = date,
  //     err => console.log('Error occurred while getting date: ', err)
  //     );
  // }

  // openDeadlineDatePicker() {
  //   DatePicker.show({
  //     date: new Date(),
  //     mode: 'date',
  //     minDate: new Date()
  //   }).then(
  //     date => this.eventDeadline = date,
  //     err => console.log('Error occurred while getting date: ', err)
  //     );
  // }
}