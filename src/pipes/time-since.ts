import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the TimeSince pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'timeSince'
})
@Injectable()
export class TimeSince {
  /*
    Takes a UTC timestamp and returns the time since Date.now() as :
      just now
      1 - 59 minutes ago
      1 - 23 hours ago
    If the date has moved on a day then
      yesterday
    If the date has moved on more that 1 but less than 7
      Sunday - Saturday
    Otherwise
      4 Dec etc.
      .
   */
  returnString: string;

  transform(value, args) {
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    let justNow = Date.now();
    let numberOfMilliSeconds = justNow - value;
    let numberOfSeconds = numberOfMilliSeconds / 1000;
    let numberOfMinutes = numberOfSeconds / 60;
    
    if (numberOfMinutes < 1) {
      this.returnString = "just now";
    } else if (numberOfMinutes < 2) {
      this.returnString = "a minute ago";
    } else if (numberOfMinutes < 60) {
      this.returnString = Math.floor(numberOfMinutes) + " minutes ago";
    } else if (numberOfMinutes < 120) {
      this.returnString = "an hour ago";
    } else if (numberOfMinutes < 360) {
      this.returnString = Math.floor(numberOfMinutes / 60) + " hours ago";
    } else if (numberOfMinutes < 1440) {
      this.returnString = "yesterday";
    } else if (numberOfMinutes < 10080) {

      // first see if it's still within the "yesterday" timeframe
      let todayDOW = new Date(justNow).getDay()
      let yesterdaysDOW = todayDOW - 1
      if(yesterdaysDOW === -1) {
        yesterdaysDOW = 6
      }

      let valuesDOW = new Date(value).getDay()

      if(valuesDOW === yesterdaysDOW) {
        this.returnString = "yesterday";
      } else {
      this.returnString = days[valuesDOW];
      }
    } else {
      let valuesDate = new Date(value);
      let valuesDay = valuesDate.getDay();
      let valuesMonth = months[valuesDate.getMonth()];
      this.returnString = valuesDay + " " + valuesMonth;
    }
    return this.returnString;
  }
}
