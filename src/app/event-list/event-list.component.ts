import { Component, OnInit } from '@angular/core';
import { EventsServiceService } from '../service/events-service.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  peopleGoing: number[];
  constructor(private eS: EventsServiceService) { }

  events: Event[];
  ngOnInit(): void {
    this.eS.getEventsFromDB().subscribe(ev => {
        this.events = ev;
    });
  }

}
