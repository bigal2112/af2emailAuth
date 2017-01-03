import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { GlobalVariables } from '../providers/global-variables';


@Injectable()
export class ProfileData {
  // We'll use this to create a database reference to the userProfile node and their avatar.
  userProfile: any;
  users: any;
  avatarPictureRef: any;
  // balancesRef: any;
  transactionsRef: any;


  // We'll use this to create an auth reference to the logged in user.
  currentUser: any;
  userDetails: any;

  constructor(public globalVars: GlobalVariables) {
    this.currentUser = firebase.auth().currentUser;
    this.userProfile = firebase.database().ref('/userProfile');
    this.users = firebase.database().ref('/users');
    this.avatarPictureRef = firebase.storage().ref('/userAvatars/');
    // this.balancesRef = firebase.database().ref('balances');
    this.transactionsRef = firebase.database().ref('transactions');
  }

  /**
  * This one should be really easy to follow, we are calling a function getUserProfile() that takes no parameters.
  * This function returns a DATABASE reference to the userProfile/uid of the current user
  * and we'll use it to get the user profile info in our page.
  */
  getUserProfile(): any {
    this.currentUser = firebase.auth().currentUser;
    return this.userProfile.child(this.currentUser.uid);
  }

  getUserDetails(): any {
    this.currentUser = firebase.auth().currentUser;
    return this.users.child(this.currentUser.uid);
  }

  /**
  * This one takes 2 string parameters, firstName & lastName, it just saves those 2 to the userProfile/uid node
  * for the current user as the firstName & lastName properties.
  */
  updateName(username: string): any {
    return this.userProfile.child(this.currentUser.uid).update({
      username: username
    });
  }

  /**
  * Pretty much the same as before, just that instead of saving the name it's saving the date of birth
  */
  updateDOB(birthDate: string): any {
    return this.userProfile.child(this.currentUser.uid).update({
      birthDate: birthDate,
    });
  }

  /**
  * This is were things get trickier, this one is taking the user's email and first it's calling the 
  * this.currentUser auth reference to call it's updateEmail() function, it's very important that you
  * understand that this is changing your email in the AUTH portion of firebase, the one stored in the 
  * userProfile/uid node hasn't changed.
  * After it successfully changes your email in the AUTH portion of firebase it updates your email in the
  * real time database in the userProfile/uid node.
  */
  updateEmail(newEmail: string): any {
    this.currentUser.updateEmail(newEmail).then(() => {
      this.userProfile.child(this.currentUser.uid).update({
        email: newEmail
      });
    }, (error) => {
      console.log(error);
    });
  }

  /**
  * Just like before this is changing the user's password, but remember, 
  * this has nothing to do with the database this is the AUTH portion of 
  * Firebase.
  */
  updatePassword(newPassword: string): any {
    this.currentUser.updatePassword(newPassword).then(() => {
      console.log("Password Changed");
    }, (error) => {
      console.log(error);
    });
  }

  updateAvatar(imageData: any) {
    if (imageData != null) {
      this.avatarPictureRef.child(this.currentUser.uid).child('avatar.png')
        .putString(imageData, 'base64', { contentType: 'image/png' })
        .then((savedPicture) => {
          this.userProfile.child(this.currentUser.uid).child('avatarURL').set(savedPicture.downloadURL);
          this.users.child(this.currentUser.uid).child('avatarURL').set(savedPicture.downloadURL);
        });
    }
  }

  getUsersBalance(firebaseUserId) {
    console.log("Returning balance for : " + firebaseUserId);
    return this.users.child(firebaseUserId).child('balance');
  }

  getUsersTransactionsCR(firebaseUserId) {
    return this.transactionsRef.orderByChild('transFromUserId').equalTo(firebaseUserId);
  }

  getUsersTransactionsDB(firebaseUserId) {
    return this.transactionsRef.orderByChild('transToUserId').equalTo(firebaseUserId);
  }

  makePayment(paymentToUser: any, paymentType: any, paymentAmount: number) {
    let nicePaymentAmount = (paymentAmount * 1).toFixed(2);

    console.log(paymentToUser);
    console.log(nicePaymentAmount);
    console.log(paymentType);

    this.userDetails = this.globalVars.getCurrentUserDetals();

    this.transactionsRef.push({
      transFromUserId: this.currentUser.uid,
      transToUserId: paymentToUser.id,
      transFromUserName: this.userDetails.username,
      transToUserName: paymentToUser.username,
      transEventTitle: paymentType,
      transType: "PAYMENT",
      transStatus: "OUTSTANDING",
      transCreatedOn: Date.now(),
      transAmount: paymentAmount * -1
    }).then((data) => {
      //  3. Update the balance of creator/user buy the new calculated cost of a ticket.
      this.users.child(this.currentUser.uid).child('balances').child(paymentToUser.id).child('balance').transaction((balance: number) => {
        balance += (paymentAmount * -1);
        return balance;
      }).then((data) => {
        //  3. Update the balance of user/creator buy the new calculated cost of a ticket.
        this.users.child(paymentToUser.id).child('balances').child(this.currentUser.uid).child('balance').transaction((balance: number) => {
          balance += (paymentAmount * 1);
          return balance;
        }).then((data) => {
          //  4. Update the balance of the user by the new calculated cost of a ticket.
          this.users.child(paymentToUser.id).child('balance').transaction((balance: number) => {
            balance += (paymentAmount * 1);
            return balance;
          }).then((data) => {
            //  5. Update the balance of the creator by the new calculated cost of a ticket times the number of ACCEPTed users.
            this.users.child(this.currentUser.uid).child('balance').transaction((balance: number) => {
              balance += (paymentAmount * -1);
              return balance;
            })
          });
        });
      });
    });
  }

  updatePaymentStatus(transFirebaseId: any, newStatus: string) {
    return this.transactionsRef.child(transFirebaseId).update({
      transStatus: newStatus
    });
  }
}