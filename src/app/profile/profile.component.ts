import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private fba: AngularFireAuth, public dialog: MatDialog) { }
  userEmail: string;
  userName: string = "Nenad Vuchkovikj";
  imagePath: any;
  imgUrl: any = "../../assets/people/profile.png";
  errorMessage: string = "";

  ngOnInit(): void {
    this.fba.authState.subscribe(authState =>{
      if(authState){
        this.userEmail = authState.email;
      }
    })
  }

  openDialog(name) {
    const dialogRef = this.dialog.open(UpdateProfileName,{
      data: {
        name: name
      }});
  }
  onFileSelected(files){
    var reader = new FileReader();
    this.imagePath = files;
    if(files.length === 0){
      return;
    }

    if(files[0].type.match(/image\/*/) == null){
      this.errorMessage = "Only images are supported.";
      setTimeout(()=>{
        this.errorMessage = "";
      }, 2000)
      return;
    }

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) =>{
      this.imgUrl = reader.result;
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
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog,){}
  ngOnInit(){
    this.userName = this.data.name;
  }
  updateUser(){
    this.dialog.closeAll();
  }

}
