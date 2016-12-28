import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public nav: NavController) {
  }
}
