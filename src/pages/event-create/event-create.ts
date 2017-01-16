import { Component } from '@angular/core';
import { NavController, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';
import { InAppBrowser } from 'ionic-native';
import { ModalUserListPage } from '../modal-user-list/modal-user-list';
import { ModalGetLocationFromMapPage } from '../modal-get-location-from-map/modal-get-location-from-map';
import { ModalFavouriteVenuesPage } from '../modal-favourite-venues/modal-favourite-venues';
import { GlobalVariables } from '../../providers/global-variables';

@Component({
  selector: 'page-event-create',
  templateUrl: 'event-create.html',
})
export class EventCreatePage {
  eventInitialPrice: number;
  eventDeadline: any;
  eventLatitude: any;
  eventLongitude: any;
  formData: any;
  public chosenUsers: any;
  public browser: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public eventData: EventData, public popoverCtrl: PopoverController,
    public globalVars: GlobalVariables, public modalCtrl: ModalController) {
    this.formData = [];
    // this.eventInitialPrice = 0;
    // this.eventDeadline = new Date().toISOString();

    // clear out the guest list to start with
    this.globalVars.setGuestList([]);
    this.chosenUsers = [];
  }

  createEvent() {
    // add the latitude and longitude to the formData object
    this.formData["latitude"] = this.eventLatitude;
    this.formData["longitude"] = this.eventLongitude;

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
    this.browser = new InAppBrowser("http://www.google.co.uk", "_system");
  }

  openMap() {
    let modal = this.modalCtrl.create(ModalGetLocationFromMapPage);
    modal.onDidDismiss((venueDetails) => {
      if (venueDetails != null) {
        this.eventLatitude = venueDetails.latitude;
        this.eventLongitude = venueDetails.longitude;
        this.formData.venue_name = venueDetails.name;
      }
    });
    // show the modal
    modal.present();
  }

  openFavouriteVenues() {
    let popover = this.popoverCtrl.create(ModalFavouriteVenuesPage);
    popover.onDidDismiss((chosenVenue) => {
      if (chosenVenue != null) {
        this.eventLatitude = chosenVenue.latitude;
        this.eventLongitude = chosenVenue.longitude;
        this.formData.venue_name = chosenVenue.name;
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