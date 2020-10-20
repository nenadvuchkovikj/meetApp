import { Component, Inject, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { EventsServiceService } from '../service/events-service.service';
import { Event } from '../models/event';
import { AngularFireStorage } from '@angular/fire/storage';

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
    private storage: AngularFireStorage
    ) { }
  @Input() eventID;

  event: any = {
    id: null,
    date: null,
    dateCreated: null,
    going: [],
    location: null,
    sender: "",
    time: null,
  }

  eventloaded:boolean = false;
  expand: boolean = true;
  addPerson: boolean = true;
  userEmail:string;
  showButtons:boolean = false;
  creatorImg: any;
  creatorName: String;
  goingPicutres: any[] = [];

  showGoingButton: boolean = true;

  editState: boolean = false;
  eventToEdit;

  ngOnInit(): void {
    this.eS.getEvent(this.eventID).subscribe(event => {
      this.showGoingButton = true;
      this.event = event;
      this.eventloaded = true;
      this.event.data.going.find(go => {
        if(go === this.userEmail){
          this.showGoingButton = false;
        }
       });

      if(this.userEmail === this.event.data.sender){
         this.showButtons = true;
      }
      this.storage.ref(`images/${this.event.data.sender}.jpg`).getDownloadURL().subscribe(res =>{
          this.creatorImg = res;
      },err => {});

      this.eS.getUser(this.event.data.sender).subscribe(user => {
        this.creatorName = user.name;
      });
      this.goingPicutres = [];
      this.event.data.going.forEach(go => {
        this.storage.ref(`images/${go}.jpg`).getDownloadURL().subscribe(picture =>{
          var name:String = "";
          var email:String = "";
          this.eS.getUser(go).subscribe(user => {
            name = user.name;
            email = user.email;
            this.goingPicutres.push({picture, name, email});
          });
        },err => {});
      })

    });

    this.fba.authState.subscribe(authState =>{
      if(authState){
        this.userEmail = authState.email;
      }
    });


  }

  eventGoing(ev, event){
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
  eventNotGoing(event){
        this.event.data.going.forEach((go,index) =>{
            if(go === this.userEmail){
              event.data.going.splice(index, 1);
              this.eS.updateGoing(event);
            }
        })
    }


  deleteEvent(ev, event){
    if(confirm('Are you sure you want to delete the event?')){
        this.eS.deleteEvent(event);
        this._snackBar.open(`${event.data.location} deleted`,'X', {
          duration: 2500,
        });
    }
  }
  openDialog(event){
    event.data.id = event.id;
    const dialogRef = this.dialog.open(DialogEditEvent, event);
  }
  openProfileDialog(user){
    const dialogRef = this.dialog.open(DialogProfile, {
      data: {
        photo: user.picture,
        name: user.name,
        email: user.email,
      }});
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

export class DialogEditEvent{
  constructor(
    private eS: EventsServiceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private atp: AmazingTimePickerService,
    private fba: AngularFireAuth,
    private dialogRef: MatDialogRef<DialogEditEvent>,
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

@Component({
  selector: 'app-dialog-profile',
  templateUrl: 'app-dialog-profile.html',
  styles:[
    `
    h2,.mat-card-subtitle{
      text-align:center;
      margin:0;
    }
    .mat-card-subtitle{
      font-size: 14px;
      margin-bottom: 10px;
    }
    `
  ]

})

export class DialogProfile{

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data) {
      this.user = data;
    }
    user: any;
}
