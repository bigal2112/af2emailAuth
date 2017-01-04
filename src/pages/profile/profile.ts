import { NavController, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { Camera } from 'ionic-native';
import { PaymentAddPage } from '../payment-add/payment-add';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public userFirebaseId: any;
  public birthDate: string;
  myBalance: any;
  // myBalanceColor: string;
  ngZone: any;
  transactionsCR: any;
  transactionsDB: any;
  transactionsAll: any;
  loader: any;
  outstandingTransactionExists: boolean;

  constructor(public nav: NavController, public alertCtrl: AlertController, public profileData: ProfileData,
    public authData: AuthData, public loadingCtrl: LoadingController, public modalCtrl: ModalController) {

    this.ngZone = new NgZone({ enableLongStackTrace: false });
    // console.log("profile.ts - Constructor");

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving your transactions...."
    });
    this.loader.present();



    this.profileData.getUserDetails().on('value', (data) => {
      this.userProfile = data.val();
      this.userFirebaseId = data.key;
      // console.log("userProfile:");
      // console.log(this.userProfile);

      // this.birthDate = this.userProfile.birthDate;

      // get my balance and set the correct colour depending on it's value
      this.myBalance = this.userProfile.balance == null ? 0.00 : this.userProfile.balance
      // if (this.myBalance >= 0) {
      //   this.myBalanceColor = "green"
      // } else {
      //   this.myBalanceColor = "red"
      // }


      // get my credit transactions (the tickets I've bought or payments I've received)
      this.profileData.getUsersTransactionsCR(this.userFirebaseId).on('value', data => {
        this.transactionsCR = [];

        data.forEach(snap => {
          // work out the event title depending on the type of transaction it is.
          // if it's a payment then the transEventTitle will hold the method i.e CASH, PAYPAL
          // so we can use this as the start of the title
          let eventTitle = "";
          if (snap.val().transType === "PAYMENT") {
            eventTitle = snap.val().transEventTitle + " payment to " + snap.val().transToUserName;
          } else {
            eventTitle = snap.val().transEventTitle
          }
          this.transactionsCR.push({
            transFirebaseId: snap.key,
            transFromUserId: snap.val().transFromUserId,
            transFromUserName: snap.val().transFromUserName,
            transToUserId: snap.val().transToUserId,
            transToUserName: snap.val().transToUserName,
            transCreatedOn: snap.val().transCreatedOn,
            transEventTitle: eventTitle,
            transAmount: snap.val().transAmount,
            transStatus: snap.val().transStatus,
            transType: snap.val().transType,
            transRejectedReason: snap.val().transRejectedReason
          });
        });

        // get my debit transactions (the tickets I've been bought)
        this.profileData.getUsersTransactionsDB(this.userFirebaseId).on('value', data => {
          this.transactionsDB = [];

          data.forEach(snap => {
            // work out the event title depending on the type of transaction it is.
            // if it's a payment then the transEventTitle will hold the method i.e CASH, PAYPAL
            // so we can use this as the start of the title
            let eventTitle = "";
            if (snap.val().transType === "PAYMENT") {
              eventTitle = snap.val().transEventTitle + " payment from " + snap.val().transFromUserName;
            } else {
              eventTitle = snap.val().transEventTitle
            }
            this.transactionsDB.push({
              transFirebaseId: snap.key,
              transFromUserId: snap.val().transFromUserId,
              transFromUserName: snap.val().transFromUserName,
              transToUserId: snap.val().transToUserId,
              transToUserName: snap.val().transToUserName,
              transCreatedOn: snap.val().transCreatedOn,
              transEventTitle: eventTitle,
              transAmount: snap.val().transAmount * -1,
              transStatus: snap.val().transStatus,
              transType: snap.val().transType,
              transRejectedReason: snap.val().transRejectedReason
            });
          });

          // concatenate the transactions lists and sort by transaction date
          let unorderedList = this.transactionsCR.concat(this.transactionsDB);
          let orderedList = unorderedList.sort(this.sortByCreatedOnDate);

          this.ngZone.run(() => {
            this.myBalance = this.userProfile.balance == null ? 0.00 : this.userProfile.balance;

            // pop the transactions into the display array
            this.transactionsAll = [];
            this.outstandingTransactionExists = false;
            orderedList.forEach(transaction => {

              let eventTitle = "";
              if (transaction.transType === "PAYMENT" && transaction.transStatus == "OUTSTANDING") {
                this.outstandingTransactionExists = true;
              }

              this.transactionsAll.push({
                transFirebaseId: transaction.transFirebaseId,
                transFromUserId: transaction.transFromUserId,
                transFromUserName: transaction.transFromUserName,
                transToUserId: transaction.transToUserId,
                transToUserName: transaction.transToUserName,
                transCreatedOn: transaction.transCreatedOn,
                transEventTitle: transaction.transEventTitle,
                transAmount: transaction.transAmount,
                transStatus: transaction.transStatus,
                transRejectedReason: transaction.transRejectedReason
              });
            });
          });
          // console.log("Transaction List");
          // console.log(this.transactionsAll);

          this.loader.dismiss();
        });
      });
    });
  }

  logOut() {
    this.authData.logoutUser()
  }

  // updateName() {
  //   let alert = this.alertCtrl.create({
  //     message: "Enter a new username",
  //     inputs: [
  //       {
  //         name: 'userName',
  //         placeholder: 'Your username',
  //         value: this.userProfile.username
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.profileData.updateName(data.userName);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // updateDOB(birthDate) {
  //   this.profileData.updateDOB(birthDate);
  // }

  // updateEmail() {
  //   let alert = this.alertCtrl.create({
  //     inputs: [
  //       {
  //         name: 'newEmail',
  //         placeholder: 'Your new email',
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.profileData.updateEmail(data.newEmail);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  // updatePassword() {
  //   let alert = this.alertCtrl.create({
  //     inputs: [
  //       {
  //         name: 'newPassword',
  //         placeholder: 'Your new password',
  //         type: 'password'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.profileData.updatePassword(data.newPassword);
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  getAvatarFromCamera() {
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
      // update Firebase storage with new image
      this.profileData.updateAvatar(imageData)
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  getAvatarFromGallery() {
    Camera.getPicture({
      quality: 95,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then(imageData => {
      // update Firebase storage with new image
      this.profileData.updateAvatar(imageData)
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  addPayment() {
    console.log("Add payment clicked");
    let paymentsModal = this.modalCtrl.create(PaymentAddPage);
    paymentsModal.present();
  }

  showTransactionDetails(transaction) {
    console.log(transaction);
    // if the transaction is an outstanding payment AND the transaction amount is > 0 (a payment TO me)
    if (transaction.transStatus === "OUTSTANDING" && transaction.transAmount > 0) {
      // show an alert to either accept or reject the payment
      let changeStatusAlert = this.alertCtrl.create({
        title: 'Payment pending!',
        message: "If you received this payment then accept it, otherwise reject it." + '\n' + "Touch anywhere outside this alert to dismiss it.",
        buttons: [
          {
            text: 'Accept',
            handler: data => {
              console.log('ACCEPTED');
              this.profileData.updatePaymentStatus(transaction.transFirebaseId, "ACCEPTED", null, null, null, null).then(() => {
                console.log("Status Updated");
              });
            }
          },
          {
            text: 'Reject',
            handler: data => {
              console.log('REJECTED');

              let rejectedReasonPrompt = this.alertCtrl.create({
                title: 'Rejected payment!',
                message: "Enter a reason you have rejected the payment",
                inputs: [
                  {
                    name: 'reason',
                    placeholder: 'Reason'
                  },
                ],
                buttons: [
                  {
                    text: 'Cancel',
                    handler: data => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: 'Send',
                    handler: data => {
                      console.log('Send clicked');

                      this.profileData.updatePaymentStatus(transaction.transFirebaseId, "REJECTED", data.reason, transaction.transAmount, transaction.transFromUserId, transaction.transToUserId).then(() => {
                        console.log("Status Updated");
                      });
                    }
                  }
                ]
              });
              rejectedReasonPrompt.present();


            }
          }
        ]
      });
      changeStatusAlert.present();
    } else if (transaction.transStatus === "REJECTED") {

      let msg = "Your payment was rejected by " + transaction.transToUserName + " because '" + transaction.transRejectedReason + "'. If this is not the case then go punch their lights out...."
      let alert = this.alertCtrl.create({
        title: 'Rejected payment!',
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  sortByCreatedOnDate(a, b) {
    if (a.transCreatedOn > b.transCreatedOn)
      return -1;
    if (a.transCreatedOn < b.transCreatedOn)
      return 1;
    return 0;
  }
}