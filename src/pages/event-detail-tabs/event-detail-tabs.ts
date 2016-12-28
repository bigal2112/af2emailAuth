import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventDetailInformationPage } from '../event-detail-information/event-detail-information'
import { EventDetailMessagesPage } from '../event-detail-messages/event-detail-messages'

@Component({
  selector: 'page-event-detail-tabs',
  templateUrl: 'event-detail-tabs.html',
})
export class EventDetailTabsPage {

  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root = EventDetailInformationPage;
  tab2Root = EventDetailMessagesPage;
  performer: any;

  constructor(public nav: NavController, public navParams: NavParams) {
    this.performer = this.navParams.get("performer");
    // console.log("Title:" + this.eventTitle);
  }
}
