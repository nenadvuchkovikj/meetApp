import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private fba: AngularFireAuth){}
  userEmail: string;

  ngOnInit(){
    this.fba.authState.subscribe(authState =>{
      if(authState){
        this.userEmail = authState.email;
      }
    })
  }


}
