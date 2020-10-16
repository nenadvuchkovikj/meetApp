import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Event } from '../models/event';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {
  eventCollection: AngularFirestoreCollection<Event>;
  eventDoc: AngularFirestoreDocument<Event>;

  arej: Event[] = [];
  events: Observable<any[]>;
  constructor(public afs: AngularFirestore, private fba: AngularFireAuth) {
    // this.events = this.afs.collection('events').valueChanges();

    this.eventCollection = this.afs.collection('events', ref => ref.orderBy('dateCreated','desc'));

    this.events = this.eventCollection.snapshotChanges()
    .map(actions =>{
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return {id , data };
        });
    });

   }



  addEvent(event: Event){
    // this.EVENTS.unshift(event);
    this.eventCollection.add(event);
  }

  getEventsFromDB(){
    return this.events;
  }

  deleteEvent(event){
    this.eventDoc = this.afs.doc(`events/${event.id}`);
    this.eventDoc.delete();
  }

  updateGoing(event){
    return this.afs.collection('events').doc(event.id).update({going : event.data.going});
  }
  ID: string;
  updateEvent(event){
    this.ID = event.id;
    delete event.id;
    return this.afs.collection('events').doc(this.ID).update({location : event.location, time: event.time, date: event.date});
  }

}
