import { Component } from '@angular/core';
import { ViewController, LoadingController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import firebase from 'firebase';

/*
  Generated class for the ModalUserList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-user-list',
  templateUrl: 'modal-user-list.html'
})
export class ModalUserListPage {

  public userList: any;
  public currentUserID: any;
  public loader: any;

  constructor(public viewCtrl: ViewController, public userData: UserData, public loadingCtrl: LoadingController) {

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
            avatarURL: snap.val().avatarURL,
            chosen: false
          });
        }
      });
      this.userList = rawList;
      this.loader.dismiss();
    });
  }

  closeModal() {
    this.viewCtrl.dismiss(this.userList);
  }

}
