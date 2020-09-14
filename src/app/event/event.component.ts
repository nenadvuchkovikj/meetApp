import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventsServiceService } from '../service/events-service.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  constructor(private eS: EventsServiceService,private fba: AngularFireAuth, private _snackBar: MatSnackBar,) { }
  @Input() event;

  events: any[] = [];
  expand: boolean = true;
  addPerson: boolean = true;
  removePerson: boolean = true;
  userEmail:string;
  showDeleteButton:boolean = false;

  ngOnInit(): void {
    this.fba.authState.subscribe(authState =>{
      this.userEmail = authState.email;
      if(this.userEmail === this.event.data.sender){
        this.showDeleteButton = true;
      }
    });

    this.eS.getEventsFromDB().subscribe(ev =>{
      this.events = ev;
    });
  }

  eventGoing(ev,event){
    this.events.forEach(ev => {
        if(ev.id === event.id){
            this.event.data.going.forEach(go =>{
                if(go === this.userEmail){
                  this.addPerson = false;
                }
            })
            if(this.addPerson){
              event.data.going.push(this.userEmail);
              this.eS.updateGoing(event);
            }
        }
        // this.eS.updateEvents(this.events);
    });
    this.expand = true;
    this.addPerson = true;
  }

  eventNotGoing(event){
    this.events.forEach(ev => {
      if(ev.id === event.id){
        this.event.data.going.forEach((go,index) =>{
          if(go === this.userEmail){
            event.data.going.splice(index, 1);
            this.eS.updateGoing(event);
          }
      })
      }
      this.eS.updateEvents(this.events);
  });
  }


  deleteEvent(ev, event){
    if(confirm('Are you sure?')){
        this.eS.deleteEvent(event);
        this._snackBar.open(`${event.data.location} deleted`,'X', {
          duration: 2500,
        });
    }
  }

}
