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

  events: any[] = [];
  ngOnInit(): void {
      this.eS.getEventsFromDB().subscribe(ev => {
        if(ev.length !== this.events.length){
          this.events = ev;
        }
      });
  }

}
