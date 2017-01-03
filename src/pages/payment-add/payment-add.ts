import { Component } from '@angular/core';
import { NavController, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { ProfileData } from '../../providers/profile-data';
import firebase from 'firebase';

@Component({
  selector: 'page-payment-add',
  templateUrl: 'payment-add.html'
})
export class PaymentAddPage {

  loader: any;
  currentUserID: any;
  userList: any;
  paymentAmount: number;
  paymentType: any;
  selectedUser: any;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public userData: UserData, public profileData: ProfileData) {
    this.paymentType = "CASH";
    this.getUserList();
  }

  getUserList() {
    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving available users...."
    });
    this.loader.present();

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
      this.userList = rawList;
      this.loader.dismiss();
    });
  }

  userRadioClicked(selectedUser) {
    this.selectedUser = selectedUser;
  }

  sendPayment() {

    let nicePaymentAmount = (this.paymentAmount * 1).toFixed(2);

    // console.log(this.selectedUser.username);
    // console.log(nicePaymentAmount);
    // console.log(this.paymentType);

    // ------------------------------
    // TODO : thorough data checking
    // ------------------------------

    let msg = "Are you sure you want to send a payment of £" + nicePaymentAmount + " to " + this.selectedUser.username + "?";

    let confirmationAlert = this.alertCtrl.create({
      title: 'Make A Payment!',
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: data => {
            console.log('Payment added');

            this.profileData.makePayment(this.selectedUser, this.paymentType, this.paymentAmount)
            this.viewCtrl.dismiss();

          }
        },
        {
          text: 'No',
          handler: data => {
            console.log('No clicked');
          }
        }
      ]
    });
    confirmationAlert.present();
  }

  closeModal() {
    let confirmationAlert = this.alertCtrl.create({
      title: 'Cancel Payment!',
      message: "You are about to lose any payment details you have entered. Are you sure you want to cancel?",
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          handler: data => {
            console.log('Yes clicked');
            this.viewCtrl.dismiss();
          }
        },
        {
          text: 'No',
          handler: data => {
            console.log('No clicked');
          }
        }
      ]
    });
    confirmationAlert.present();
  }
}
