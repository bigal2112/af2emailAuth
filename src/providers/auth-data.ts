import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import * as firebase from 'firebase';

@Injectable()
export class AuthData {
    public userProfile: any;
    fireAuth: any;

    constructor(public af: AngularFire) {

        this.userProfile = firebase.database().ref('userProfile');

        af.auth.subscribe(user => {
            if (user) {
                this.fireAuth = user.auth;
                console.log(user);
            }
        });
    }

    loginUser(newEmail: string, newPassword: string): any {
        return this.af.auth.login({ email: newEmail, password: newPassword });
    }

    resetPassword(email: string): any {
        return firebase.auth().sendPasswordResetEmail(email);
    }

    logoutUser(): any {
        return this.af.auth.logout();
    }

    // signupUser(newEmail: string, newPassword: string): any {
    //   return this.af.auth.createUser({ email: newEmail, password: newPassword });
    // }

    signupUser(newEmail: string, newPassword: string): any {
        return this.af.auth.createUser({ email: newEmail, password: newPassword })
            .then((newUser) => {
                // we have created a new user so log them in
                this.af.auth.login({ email: newEmail, password: newPassword })
                    .then((authenticatedUser) => {
                        // we're in and authenricated to save some user details into thier userProfile
                        this.userProfile.child(authenticatedUser.uid).set({ email: newEmail });
                    })
            });
    }
}