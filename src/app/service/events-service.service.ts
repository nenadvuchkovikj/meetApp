import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {

  constructor() { }
  EVENTS: any = [
    {
        eventName: "Gallerka",
        eventHost: "Nenad Vuchkovikj",
        hostPicture: "/assets/people/Nenad-Vuchkovikj.jpg",
        eventDate: "9/09/2020",
        eventTime: "19:30",
        going: [
          {
            picture: "/assets/people/Nenad-Vuchkovikj.jpg",
            name: "Nenad Vuchkovikj"
          }
        ]
    },
    {
        eventName: "Seir",
        eventHost: "Stefan Popovikj",
        hostPicture: "/assets/people/Stefan-Popovikj.jpg",
        eventDate: "10/09/2020",
        eventTime: "12:30",
        going: [
          {
            picture: "/assets/people/Stefan-Popovikj.jpg",
            name: "Stefan Popovikj"
          }
        ]
    }

  ]
  getEvents() {
      return this.EVENTS;
  }
  addEvent(event: Object){
    this.EVENTS.unshift(event);
  }
  updateEvents(events: any[]){
    this.EVENTS = events;
  }
}
