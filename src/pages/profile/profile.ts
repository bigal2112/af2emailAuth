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
  myBalanceColor: string;
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

    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.userFirebaseId = data.key;
      // console.log("userProfile:");
      // console.log(this.userProfile);

      this.birthDate = this.userProfile.birthDate;

      this.ngZone.run(() => {
        this.transactionsDB = [];
        this.transactionsAll = [];

        this.profileData.getUsersBalance(this.userFirebaseId).on('value', data => {
          this.myBalance = data.val().balance == null ? 0.00 : data.val().balance;
          if (this.myBalance >= 0) {
            this.myBalanceColor = "green"
          } else {
            this.myBalanceColor = "red"
          }

          this.profileData.getUsersTransactions(this.userFirebaseId).on('value', data => {
            this.transactionsCR = [];

            data.forEach(snap => {
              this.transactionsCR.push({
                transCreatedOn: snap.val().transCreatedOn,
                transAmount: snap.val().transAmount,
                transColor: "green"
              });
            });

            let unorderedList = this.transactionsCR.concat(this.transactionsDB);
            let orderedList = unorderedList.sort(this.sortByCreatedOnDate);

            orderedList.forEach(transaction => {
              this.transactionsAll.push({
                transCreatedOn: transaction.transCreatedOn,
                transAmount: transaction.transAmount,
                transColor: transaction.transColor
              });
            });

            console.log("Transaction List");
            console.log(this.transactionsAll);

            this.loader.dismiss();
          });

        });
      });


    });



  }

  logOut() {
    this.authData.logoutUser()
  }

  updateName() {
    let alert = this.alertCtrl.create({
      message: "Enter a new username",
      inputs: [
        {
          name: 'userName',
          placeholder: 'Your username',
          value: this.userProfile.username
        }
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateName(data.userName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate) {
    this.profileData.updateDOB(birthDate);
  }

  updateEmail() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newEmail',
          placeholder: 'Your new email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateEmail(data.newEmail);
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword() {
    let alert = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePassword(data.newPassword);
          }
        }
      ]
    });
    alert.present();
  }

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

  sortByCreatedOnDate(a, b) {
    if (a.transCreatedOn < b.transCreatedOn)
      return -1;
    if (a.transCreatedOn > b.transCreatedOn)
      return 1;
    return 0;
  }
}