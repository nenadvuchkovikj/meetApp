import { Component, OnInit } from '@angular/core';
import { EventsServiceService } from '../service/events-service.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  constructor(private eS: EventsServiceService) { }

  events: any[] = [];
  ngOnInit(): void {
      this.eS.getEventsFromDB().subscribe(ev => {
        if(ev.length > this.events.length){
          ev.forEach(event => {
            var bool:Boolean = false;
            this.events.forEach(myEvent => {
              if(event.id === myEvent.id){
                bool = true;
              }
            })
            if(!bool){
              this.events.push(event);
              this.events.sort(function compare(a,b ) {
                if ( a.data.dateCreated < b.data.dateCreated ){
                  return 1;
                }
                if ( a.data.dateCreated > b.data.dateCreated ){
                  return -1;
                }
                return 0;
              })
            }
          });
        }else if(ev.length < this.events.length){
              var ID;
              this.events.forEach((myEvent,index) => {
                  if(ev.some(ev => ev.id === myEvent.id)){
                  } else{
                    ID = index;
                  }
              });
              this.events.splice(ID, 1);
        }
      });

  }

}
