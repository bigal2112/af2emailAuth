import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { EventData } from '../../providers/event-data';
import { GlobalVariables } from '../../providers/global-variables';
import { ConnectivityService } from '../../providers/connectivity-service';
import { Geolocation } from 'ionic-native';

// declare these variables so the typescript doesn't balk.
declare var EVDB: any;
declare var google;

@Component({
  selector: 'page-event-detail-information',
  templateUrl: 'event-detail-information.html'
})
export class EventDetailInformationPage {

  // variables for the map
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  mapInitialised: boolean = false;
  apiKey: any;

  eventId: any;
  firebaseEventId: any;
  firebaseInviteId: any;
  loader: any;
  groupImages: any;
  performer: any;
  sliderOptions: any;
  imgCounter: number;

  eventVenueName: any;
  eventStartTime: any;
  eventVenueAddress: any;
  eventCity: any;
  eventCountry: any;
  eventTitle: any;

  invitedUsers: any;

  eventType: string;    // "MY_EVENT" or "INVITED_TO_EVENT"
  statusTrack: boolean;
  statusAccept: boolean;
  statusReject: boolean;
  statusTrackColor: string;
  statusAcceptColor: string;
  statusRejectColor: string;

  public eventLatitude: any;
  public eventLongitude: any;

  constructor(public nav: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public eventData: EventData, public globalVars: GlobalVariables, public toastCtrl: ToastController, public connectivityService: ConnectivityService) {

    this.sliderOptions = {
      pager: true
    };

    this.eventId = this.globalVars.getEventfulEventId();
    this.firebaseEventId = this.globalVars.getFirebaseEventId();
    this.firebaseInviteId = this.globalVars.getFirebaseInviteId();
    this.eventType = this.globalVars.getEventType();

    // console.log("eventId:" + this.eventId);
    // console.log("firebaseEventId:" + this.firebaseEventId);

    // console.log("Search for:" + this.searchString);
    // they've entered a search criteria, let's see what it brings back.....

    var oArgs = {
      app_key: "n7XgQ8mk3VVsc6Qn",
      id: this.eventId,
      image_sizes: "block250,block188,medium",
    };

    // show loading control
    this.loader = this.loadingCtrl.create({
      content: "Retrieving event details...."
    });
    this.loader.present();

    // grab the current scope to use withing the EVDB callback
    let that = this;

    // ---------------------------------------------------------
    // TODO: put the call to EVDB into the event-data provider.
    // ---------------------------------------------------------

    // go get the results from Eventful
    EVDB.API.call("json/events/get", oArgs, function (eventData) {
      // console.log(eventData);
      that.loader.dismiss();

      // if no results returned then inform user
      if (typeof (eventData) == 'undefined' || eventData == null) {
        console.log("SOME FUCKING WEIRD SHIT ERROR");
      } else {

        // so we've got the event details back
        // load them into the member variable to display on the html.

        // get the performs image
        let imagesObj = eventData.images;

        that.groupImages = [];

        if (imagesObj != null) {
          let imageObj = imagesObj.image
          that.imgCounter = 0;

          // 1 image         : push the 1 image to the array
          // loads of images : push all of them to the array
          if (typeof (imageObj.length) === 'undefined') {
            that.groupImages.push({
              image: imageObj.block188.url
            });
          } else {
            imageObj.forEach(element => {
              that.groupImages.push({
                image: imageObj[that.imgCounter].block188.url
              });

              that.imgCounter++;
            });

          }
        } else {
          // there are no images so push the default to the array
          that.groupImages.push({
            image: "img/no-picture-available.jpg"
          });
        }

        let performerObj = eventData.performers
        if (performerObj != null) {
          that.performer = performerObj.performer.name;
        }

        that.eventVenueName = eventData.venue_name;
        that.eventStartTime = eventData.start_time;
        that.eventVenueAddress = eventData.address;
        that.eventCity = eventData.city;
        that.eventTitle = eventData.title;
        that.eventCountry = eventData.country;
        that.eventLatitude = eventData.latitude;
        that.eventLongitude = eventData.longitude;
      }

      console.log("Event Data");
      console.log(eventData);
      console.log(that.eventLatitude);
      console.log(that.eventLongitude);

      that.loadGoogleMaps();
    });

    // ---------------------------------------------
    // Get the invited users if I'm the creator
    // ---------------------------------------------
    if (this.eventType === "MY_EVENT") {
      this.eventData.getInvitedUsers(this.firebaseEventId).on('value', data => {
        if (data == null || typeof (data) == 'undefined') {
          console.log("NO INVITES");
        } else {

          this.invitedUsers = [];
          data.forEach(invitedUser => {
            this.invitedUsers.push({
              imageMed: invitedUser.val().imageMed,
              inviteAccepted: invitedUser.val().inviteAccepted,
              inviteeAvatarURL: invitedUser.val().inviteeAvatarURL,
              inviteeName: invitedUser.val().inviteeName
            });
          });

          console.log(this.invitedUsers);
        }
      })
    }

    // ---------------------------------------------
    // Get the acceptance details if I'm an invitee
    // ---------------------------------------------
    if (this.eventType === "INVITED_TO_EVENT") {
      // get the current status of the inviteAccepted field in the Firebase node for this invite and update the checkboxes if needed
      this.eventData.getInviteDetails(this.firebaseInviteId).on('value', data => {
        let inviteDetails = data.val()

        if (inviteDetails.inviteAccepted === "TRACK") {
          this.statusTrack = true;
          this.statusTrackColor = "red";
        } else if (inviteDetails.inviteAccepted === "ACCEPT") {
          this.statusAccept = true;
          this.statusAcceptColor = "red";
        } else if (inviteDetails.inviteAccepted === "REJECT") {
          this.statusReject = true;
          this.statusRejectColor = "red";
        }
      });
    }

    


  }

  updateAcceptanceStatus(statusClicked: string) {
    //  statusClicked will be either TRACK, ACCEPT or REJECT
    //  when clicked we want to clear out the other statuses

    if (statusClicked === "TRACK") {
      this.statusTrack = !this.statusTrack;
      this.statusAccept = false;
      this.statusReject = false;
    } else if (statusClicked === "ACCEPT") {
      this.statusTrack = false;
      this.statusAccept = !this.statusAccept;
      this.statusReject = false;
    } else {
      this.statusTrack = false;
      this.statusAccept = false;
      this.statusReject = !this.statusReject;
    }

    // change the colours of the statuses labels and assign the new status to newStatus.
    let newStatus = "NOT YET"

    if (this.statusTrack) {
      this.statusTrackColor = "red";
      newStatus = "TRACK";
    } else {
      this.statusTrackColor = "black";
    }
    if (this.statusAccept) {
      this.statusAcceptColor = "red";
      newStatus = "ACCEPT";
    } else {
      this.statusAcceptColor = "black";
    }
    if (this.statusReject) {
      this.statusRejectColor = "red";
      newStatus = "REJECT";
    } else {
      this.statusRejectColor = "black";
    }

    // finally update Firebase with the new status
    this.eventData.updateInviteAcceptedStatus(this.firebaseInviteId, newStatus).then(() => {
      let toast = this.toastCtrl.create({
        message: 'Status updated successfully',
        duration: 1500
      });
      toast.present();
    })
  }

  loadGoogleMaps() {

    this.addConnectivityListeners();

    if (typeof google == "undefined" || typeof google.maps == "undefined") {

      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      if (this.connectivityService.isOnline()) {
        console.log("online, loading map");

        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }

        let script = document.createElement("script");
        script.id = "googleMaps";

        if (this.apiKey) {
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }

        document.body.appendChild(script);

      }
    }
    else {

      if (this.connectivityService.isOnline()) {
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }

    }

  }

  initMap() {

    this.mapInitialised = true;

    // Geolocation.getCurrentPosition().then((position) => {

      console.log("Setting map position to " + this.eventLatitude + ", " + this.eventLongitude);
      let latLng = new google.maps.LatLng(this.eventLatitude, this.eventLongitude);

      let mapOptions = {
        center: latLng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: false
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      let marker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          title: this.eventVenueName
        });

    // });

  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

  addConnectivityListeners() {

    let onOnline = () => {

      setTimeout(() => {
        if (typeof google == "undefined" || typeof google.maps == "undefined") {

          this.loadGoogleMaps();

        } else {

          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }
      }, 2000);

    };

    let onOffline = () => {
      this.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }

}
