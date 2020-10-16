import { Component, Inject, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { EventsServiceService } from '../service/events-service.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  constructor(
    private eS: EventsServiceService,
    private fba: AngularFireAuth,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    ) { }
  @Input() event;

  events: any[] = [];
  expand: boolean = true;
  addPerson: boolean = true;
  userEmail:string;
  showButtons:boolean = false;
  loaded:boolean = false;

  showGoingButton: boolean = true;

  editState: boolean = false;
  eventToEdit;

  ngOnInit(): void {
    this.fba.authState.subscribe(authState =>{
      if(authState){
        this.userEmail = authState.email;
      }
      this.event.data.going.find(go => {
       if(go === this.userEmail){
         this.showGoingButton = false;
       }
      })
      if(this.userEmail === this.event.data.sender){
        this.showButtons = true;
      }
      setTimeout(()=>{
        this.loaded = true;
      }, 250);
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
  openDialog(event){
    event.data.id = event.id;
    const dialogRef = this.dialog.open(DialogEditItem, event);
  }

}


@Component({
  selector: 'app-dialog-edit-event',
  templateUrl: 'app-dialog-edit-event.html',
  styles:[
    `
      .mat-form-field-wrapper {
        padding-bottom: 0 !important;
      }
      .full-width{
        width: 100%;
      }
      @media only screen and (max-width: 700px) {
        .media{
          width: 100%;
        }
      }
    `
  ]

})




export class DialogEditItem{
  constructor(
    private eS: EventsServiceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private atp: AmazingTimePickerService,
    private fba: AngularFireAuth,
    private dialogRef: MatDialogRef<DialogEditItem>,
    @Inject(MAT_DIALOG_DATA) event) {
      this.event = event;
      this.updateTime = this.event.time;
      this.updateLoc = this.event.location;
      this.updateDate = this.event.date.split("/");
      this.updateDate = new Date(parseInt(this.updateDate[2])+2000,parseInt(this.updateDate[1])-1,parseInt(this.updateDate[0]));
    }

    updateTime;
    updateLoc;
    updateDate;

  event: Event = {
      date: null,
      dateCreated: null,
      going: [],
      location: null,
      sender: "",
      time: null,
    }
 error:boolean = false;


 updatePost(message: string, action: string){
   if(this.updateLoc === null || this.updateDate === null || this.updateTime === null ||
      this.updateLoc === "" || this.updateDate === "" || this.updateTime === ""){
     this.error = true;
   } else{
     this.fba.authState.subscribe(authState =>{
       this.event.location = this.updateLoc;
       this.event.date = this.getEventDate(this.updateDate);
       this.event.time = this.updateTime;
       this.eS.updateEvent(this.event);
       this._snackBar.open(message,action, {
         duration: 2500,
       });
       this.dialog.closeAll();
       this.error = false;
     });
   }
 }

 openTime(){
   const amazingTimePicker = this.atp.open();
   amazingTimePicker.afterClose().subscribe(time =>{
       console.log(time);
   });
 }
 getEventDate(date){
  let eDay:any = new Date(date).getDate();
  if(eDay < 10){
    eDay = '0' + eDay;
  }
  let eMonth:any
  if(eDay === '01'){
    eMonth = (new Date(date).getUTCMonth()+2);
  }else{
    eMonth = (new Date(date).getUTCMonth()+1);
  }

  if(eMonth < 10){
    eMonth = '0' + eMonth;
  } else if(eMonth === 13){
    eMonth = '01';
  }
  let eYear = new Date(date).getFullYear().toString().substr(-2);
  return (eDay +'/' + eMonth +'/'+ eYear);
  }

}
