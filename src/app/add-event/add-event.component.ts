import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventsServiceService } from '../service/events-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent{

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogAddItem);

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

}

@Component({
  selector: 'app-dialog-add-item',
  templateUrl: 'app-dialog-add-item.html',
  styleUrls: ['app-dialog-add-item.scss']
})
export class DialogAddItem{
  constructor(
     private eS: EventsServiceService,
     private _snackBar: MatSnackBar,
     public dialog: MatDialog,
     private atp: AmazingTimePickerService,
     private fba: AngularFireAuth) {}
  event: any = {
    date: null,
    dateCreated: null,
    going: [],
    location: null,
    sender: "",
    time: null,
  }
  error:boolean = false;
  addPost(message: string, action: string){
    if(this.event.location === null || this.event.date === null || this.event.time === null ||
       this.event.location === "" || this.event.date === "" || this.event.time === ""){
      this.error = true;
    } else{
      this.fba.authState.subscribe(authState =>{
        this.event.sender = authState.email;
        this.event.date = (new Date(this.event.date).getDate() +'/' +(new Date(this.event.date).getUTCMonth() +1)+'/'+ new Date(this.event.date).getFullYear());
        this.event.dateCreated = Math.round(new Date().getTime() / 1000);
        this.event.going.push(this.event.sender);
        this.eS.addEvent(this.event);
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
}
