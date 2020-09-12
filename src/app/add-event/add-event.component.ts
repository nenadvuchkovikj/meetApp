import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventsServiceService } from '../service/events-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AmazingTimePickerService } from 'amazing-time-picker';

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
  styles:[
    `
      .mat-form-field-wrapper {
        padding-bottom: 0 !important;
      }
      .full-width{
        width: 100%;
      }
    `
  ]

})
export class DialogAddItem{
  constructor(
     private eS: EventsServiceService,
     private _snackBar: MatSnackBar,
     public dialog: MatDialog,
     private atp: AmazingTimePickerService) {}
  event: any = {
    eventName: null,
    eventHost: "Nenad Vuchkovikj",
    hostPicture: "/assets/people/Nenad-Vuchkovikj.jpg",
    eventDate: null,
    eventTime: null,
    going: [
      {
        picture: "/assets/people/Nenad-Vuchkovikj.jpg",
        name: "Nenad Vuchkovikj"
      }
    ]
  }
  error:boolean = false;
  addPost(message: string, action: string){
    if(this.event.eventName === null || this.event.eventDate === null || this.event.eventTime === null ||
       this.event.eventName === "" || this.event.eventDate === "" || this.event.eventTime === ""){
      this.error = true;
    } else{
      this.eS.addEvent(this.event);
      this._snackBar.open(message,action, {
        duration: 2500,
      });
      this.dialog.closeAll();
      this.error = false;
    }
  }
  openTime(){
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time =>{
        console.log(time);
    });
  }
}
