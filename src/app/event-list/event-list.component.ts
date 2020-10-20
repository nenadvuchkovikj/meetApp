import { Component, OnInit } from '@angular/core';
import { EventsServiceService } from '../service/events-service.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  peopleGoing: number[];
  constructor(private eS: EventsServiceService) { }

  events: any[];
  AddedEvents:boolean = false;
  ngOnInit(): void {
      this.eS.getEventsFromDB().subscribe(ev => {
        if(!this.AddedEvents){
          this.events = ev;
          this.AddedEvents = true;
        }
      });
  }

}
