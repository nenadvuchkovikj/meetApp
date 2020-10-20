import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { storage } from 'firebase';
import { finalize } from 'rxjs/operators';
import { EventsServiceService } from '../service/events-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private fba: AngularFireAuth, public dialog: MatDialog, private storage: AngularFireStorage, private eS: EventsServiceService) { }
  userEmail: string;
  userName: string;
  imagePath: any;
  imgUrl: any = "../../assets/people/profile.png";
  errorMessage: string = "";

  ngOnInit(): void {
    this.fba.authState.subscribe(authState =>{
      if(authState){
        this.userEmail = authState.email;
      }
        this.storage.ref(`images/${this.userEmail}.jpg`).getDownloadURL().subscribe(res => this.imgUrl = res);
        this.eS.getUser(this.userEmail).subscribe(res => {
          this.userName = res.name;
        })
    })
  }

  openDialog(name, email) {
    const dialogRef = this.dialog.open(UpdateProfileName,{
      data: {
        name: name,
        email: email
      }});
  }
  onFileSelected(event: any){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgUrl = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      var filePath = `images/${this.userEmail}.jpg`
      const fileRef = this.storage.ref(filePath);
      console.log(event.target.files[0]);
      this.storage.upload(filePath, event.target.files[0])
      .snapshotChanges().pipe(
        finalize(() => {
              fileRef.getDownloadURL().subscribe()
            })
          ).subscribe();
    }
  }

}
@Component({
  selector: 'update-profile-name',
  templateUrl: 'update-profile-name.component.html',
  styles: [`
    .example-form{
      padding: 10px;
    }
  `]
})
export class UpdateProfileName{
  userName: String;
  userEmail: String;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, private eS: EventsServiceService, private _snackBar: MatSnackBar,){}
  ngOnInit(){
    this.userName = this.data.name;
    this.userEmail = this.data.email;
  }
  updateUser(){
    this.eS.updateUser(this.userEmail, this.userName);
    this._snackBar.open('User Updated','X', {
      duration: 2500,
    });
    this.dialog.closeAll();
  }

}
