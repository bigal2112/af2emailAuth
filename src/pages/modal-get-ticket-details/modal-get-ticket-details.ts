import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

/*
  Generated class for the ModalGetTicketDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-get-ticket-details',
  templateUrl: 'modal-get-ticket-details.html'
})
export class ModalGetTicketDetailsPage {

  ticketFacevalue: any;
  ticketDeadline: any;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    // get passed parameters
    this.ticketFacevalue = navParams.get("ticketFacevalue");
    this.ticketDeadline = navParams.get("ticketDeadline");

    // if the passed deadline date is null then default it to now.
    if (this.ticketDeadline == null) {
      this.ticketDeadline = new Date().toISOString();
    }
  }

  saveTicketDetails() {
    console.log("saveTicketDetails");
    let returnData = [];
    returnData.push({
      ticketFacevalue: this.ticketFacevalue,
      ticketDeadline: this.ticketDeadline
    })

    console.log(returnData);
    this.viewCtrl.dismiss({ returnData });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
