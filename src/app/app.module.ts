import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
// Import pages
import { HomePage } from '../pages/home/home';
import { EventSearchPage } from '../pages/event-search/event-search';
// import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailInformationPage } from '../pages/event-detail-information/event-detail-information';
import { EventDetailMessagesPage } from '../pages/event-detail-messages/event-detail-messages';
import { EventDetailTabsPage } from '../pages/event-detail-tabs/event-detail-tabs';
import { EventAddDetailsPage } from '../pages/event-add-details/event-add-details';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/sign-up/sign-up';
import { PaymentAddPage } from '../pages/payment-add/payment-add';

import { ModalUserListPage } from '../pages/modal-user-list/modal-user-list';

// Importing provider
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { ProfileData } from '../providers/profile-data';
import { UserData } from '../providers/user-data';
import { GlobalVariables } from '../providers/global-variables';
import { ConnectivityService } from '../providers/connectivity-service';
import { TimeSince } from '../pipes/time-since';

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
    EventSearchPage,
    // EventCreatePage,
    EventDetailInformationPage,
    EventDetailMessagesPage,
    EventDetailTabsPage,
    EventAddDetailsPage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    PaymentAddPage,
    ModalUserListPage,
    TimeSince
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventSearchPage,
    // EventCreatePage,
    EventDetailInformationPage,
    EventDetailMessagesPage,
    EventDetailTabsPage,
    EventAddDetailsPage,
    LoginPage,
    ProfilePage,
    ResetPasswordPage,
    SignupPage,
    PaymentAddPage,
    ModalUserListPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthData,
    EventData,
    ProfileData,
    UserData,
    GlobalVariables,
    ConnectivityService],
})
export class AppModule { }
