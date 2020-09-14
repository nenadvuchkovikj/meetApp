import { stringify } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class EventsServiceService {
  eventCollection: AngularFirestoreCollection<any>;
  eventDoc: AngularFirestoreDocument<any>;

  arej: any[] = [];
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
    // this.EVENTS.unshift(event);
    this.eventCollection.add(event);
  }

  updateEvents(events: any[]){
    this.EVENTS = events;
  }

  getEventsFromDB(){
    return this.events;
  }

  deleteEvent(event){
    this.eventDoc = this.afs.doc(`events/${event.id}`);
    this.eventDoc.delete();
  }

  updateGoing(event){
    // this.eventDoc = this.afs.doc(`events/${event.id}`);
    // this.eventDoc.update(event);
    return this.afs.collection('events').doc(event.id).update({going :event.data.going});
  }

}
