import { Component, Input, OnInit } from '@angular/core';
import { EventsServiceService } from '../service/events-service.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  constructor(private eS: EventsServiceService) { }
  @Input() event;

  events: any[] = [];
  expand: boolean = true;
  addPerson: boolean = true;
  removePerson: boolean = true;

  ngOnInit(): void {
    this.events = this.eS.getEvents();
  }

  eventGoing(event){
    this.events.forEach(ev => {
        if(ev.eventName === event.eventName){
          ev.going.forEach(go => {
              if(go.name === "Nenad Vuchkovikj"){
                  this.addPerson = false;
              }
          });
          if(this.addPerson){
            ev.going.push({
              picture: "/assets/people/Nenad-Vuchkovikj.jpg",
              name: "Nenad Vuchkovikj"
            });
          }
        }
        this.eS.updateEvents(this.events);
    });
    this.expand = true;
    this.addPerson = true;
  }

  eventNotGoing(event){
    this.events.forEach(ev => {
      if(ev.eventName === event.eventName){
        ev.going.forEach((go, index) =>{
            if(go.name === "Nenad Vuchkovikj"){
                ev.going.splice(index, 1);
            }
        })
      }
      this.eS.updateEvents(this.events);
  });
  }


}
