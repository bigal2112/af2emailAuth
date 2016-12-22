import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
// Import pages
import { HomePage } from '../pages/home/home';
import { EventAddPage } from '../pages/event-add/event-add';
import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventAddDetailsPage } from '../pages/event-add-details/event-add-details';
import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/sign-up/sign-up';

import { ModalUserListPage } from '../pages/modal-user-list/modal-user-list';

// Importing provider
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { ProfileData } from '../providers/profile-data';
import { UserData } from '../providers/user-data';

// Import the AF2 Module
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

// AF2 Settings
export const firebaseConfig = {
  apiKey: "AIzaSyBtFYjgR87W6shCmnYwtjCH9CGll5OVFpo",
  authDomain: "af2emailauth.firebaseapp.com",
  databaseURL: "https://af2emailauth.firebaseio.com",
  storageBucket: "af2emailauth.appspot.com",
  messagingSenderId: "136236707392"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventAddPage,
    EventCreatePage,
    EventDetailPage,
    EventAddDetailsPage,
    EventListPage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    ModalUserListPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventAddPage,
    EventCreatePage,
    EventDetailPage,
    EventAddDetailsPage,
    EventListPage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    ModalUserListPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthData,
    EventData,
    ProfileData,
    UserData]
})
export class AppModule { }
