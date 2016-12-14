import { NavController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ProfileData } from '../../providers/profile-data';
import { AuthData } from '../../providers/auth-data';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;

  constructor(public nav: NavController, public alertCtrl: AlertController, public profileData: ProfileData,
    public authData: AuthData) {

      console.log("profile.ts - Constructor");
    
    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      console.log("userProfile:");
      console.log(this.userProfile);
      
      this.birthDate = this.userProfile.birthDate;
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
}