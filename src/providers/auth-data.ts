import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import firebase from 'firebase';

@Injectable()
export class AuthData {
    public userProfile: any;
    public users: any;
    fireAuth: any;

    constructor(public af: AngularFire) {

        this.userProfile = firebase.database().ref('userProfile');
        this.users = firebase.database().ref('users');

        af.auth.subscribe(user => {
            if (user) {
                this.fireAuth = user.auth;
                // console.log(user);
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

    signupUser(newEmail: string, newPassword: string, newUserName: string): any {
        return this.af.auth.createUser({ email: newEmail, password: newPassword })
            .then((newUser) => {
                // we have created a new user so log them in
                this.af.auth.login({ email: newEmail, password: newPassword })
                    .then((authenticatedUser) => {
                        // we're in and authenticated to save some user details into thier userProfile
                        this.userProfile.child(authenticatedUser.uid).set({ email: newEmail, username: newUserName, avatarURL: "https://firebasestorage.googleapis.com/v0/b/af2emailauth.appspot.com/o/guestProfile%2Fdefault-avatar.png?alt=media&token=affcce1a-4b2f-44c8-b73c-0bd3e5f6b209" });
                        this.users.child(authenticatedUser.uid).set({ email: newEmail, username: newUserName, balance: 0.00, avatarURL: "https://firebasestorage.googleapis.com/v0/b/af2emailauth.appspot.com/o/guestProfile%2Fdefault-avatar.png?alt=media&token=affcce1a-4b2f-44c8-b73c-0bd3e5f6b209" });
                    })
            });
    }
}