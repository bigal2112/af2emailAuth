import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { Camera } from 'ionic-native';

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

  constructor(public nav: NavController, public alertCtrl: AlertController, public profileData: ProfileData,
    public authData: AuthData, public loadingCtrl: LoadingController) {

    this.ngZone = new NgZone({ enableLongStackTrace: false });
    // console.log("profile.ts - Constructor");

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving your transactions...."
    });
    this.loader.present();

    this.ngZone.run(() => {

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

        // get my credit transactions (the tickets I've bought)
        this.profileData.getUsersTransactionsCR(this.userFirebaseId).on('value', data => {
          this.transactionsCR = [];

          data.forEach(snap => {
            this.transactionsCR.push({
              transCreatedOn: snap.val().transCreatedOn,
              transEventTitle: snap.val().transEventTitle,
              transAmount: snap.val().transAmount
            });
          });

          // get my debit transactions (the tickets I've been bought)
          this.profileData.getUsersTransactionsDB(this.userFirebaseId).on('value', data => {
            this.transactionsDB = [];

            data.forEach(snap => {
              this.transactionsDB.push({
                transCreatedOn: snap.val().transCreatedOn,
                transEventTitle: snap.val().transEventTitle,
                transAmount: snap.val().transAmount * -1
              });
            });

            // concatenate the transactions lists and sort by transaction date
            let unorderedList = this.transactionsCR.concat(this.transactionsDB);
            let orderedList = unorderedList.sort(this.sortByCreatedOnDate);

            // pop the transactions into the display array
            this.transactionsAll = [];
            orderedList.forEach(transaction => {
              this.transactionsAll.push({
                transCreatedOn: transaction.transCreatedOn,
                transEventTitle: transaction.transEventTitle,
                transAmount: transaction.transAmount
              });
            });

            // console.log("Transaction List");
            // console.log(this.transactionsAll);

            this.loader.dismiss();
          });
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
  }

  sortByCreatedOnDate(a, b) {
    if (a.transCreatedOn > b.transCreatedOn)
      return -1;
    if (a.transCreatedOn < b.transCreatedOn)
      return 1;
    return 0;
  }
}