import { Component } from '@angular/core';
import { ViewController, LoadingController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { GlobalVariables } from '../../providers/global-variables';
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
  public guestList: any;

  constructor(public viewCtrl: ViewController, public userData: UserData, public loadingCtrl: LoadingController, public globalVars: GlobalVariables) {

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving available users...."
    });
    this.loader.present();

    // get the current guest list
    this.guestList = [];
    this.guestList = this.globalVars.getGuestList();
    console.log("Global Guest list");
    console.log(this.guestList);

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
          let alreadyChosen = this.alreadyInTheGuestList(snap.key);
          rawList.push({
            id: snap.key,
            username: snap.val().username,
            avatarURL: snap.val().avatarURL,
            chosen: alreadyChosen,
            gratis: false
          });
        }
      });
      // set the list for the HTML loop
      this.userList = rawList;
      // console.log("User List");
      // console.log(this.userList);

      // remove the loader
      this.loader.dismiss();
    });
  }

  closeModal() {
    // save the list in the gloabl variable as well
    this.viewCtrl.dismiss();
  }

  alreadyInTheGuestList(userId: string): boolean {
    // console.log("User ID: " + userId);

    let cntr = 0;
    let foundIt = false;
    let guestListSize = this.guestList.length;

    while (cntr < guestListSize && !foundIt) {
      if (this.guestList[cntr].id === userId && this.guestList[cntr].chosen) {
        // console.log("Returning TRUE");
        foundIt = true;
      }

      cntr++;
    }
    return foundIt;
  }


  addGuests() {
    // save the list in the global variable as well
    this.globalVars.setGuestList(this.userList);
    this.viewCtrl.dismiss();
  }

  toggleChosenState (index) {
    console.log("toggleChosenState: " + this.userList[index].username);
    this.userList[index].chosen = !this.userList[index].chosen;

    // if we have just unselected chosen then automatically unselect
    // gratis as the guest can't have a freebie if their not going.
    if(!this.userList[index].chosen) {
      this.userList[index].gratis = false;
    }
  }

  toggleGratisState(index) {
    console.log("toggleGratisState: " + this.userList[index].username);
    this.userList[index].gratis = !this.userList[index].gratis;

    // if we have just selected gratis then automatically select
    // chosen as the guest must be going if their getting a freebie
    if(this.userList[index].gratis) {
      this.userList[index].chosen = true;
    }
  }
}
