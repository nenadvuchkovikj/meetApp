import { Component, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  @Output() readonly modeSwitched = new EventEmitter<boolean>();
  darkMode:string = JSON.parse(localStorage.getItem('dmode'));
  switcher:boolean;
  userEmail: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(){
    if(this.darkMode === 'theme-dark'){
      this.switcher = true;
    }
    this.fba.authState.subscribe(authState =>{
      if(authState){
        this.userEmail = authState.email;
      }
    });
  }

  constructor(private breakpointObserver: BreakpointObserver,
              private auth: AngularFireAuth,
              private router: Router,
              private _snackBar: MatSnackBar,
              private fba: AngularFireAuth,
    ) {}

  onDarkModeSwitched({ checked }: MatSlideToggleChange){
    this.modeSwitched.emit(checked);
  }

  onLogout(){
    if(this.userEmail){
      if(confirm('Are you sure you want to log out?'))
      {
        this.auth.signOut().then(() =>{
          this.userEmail = undefined;
          this.router.navigate(['login'])
          this._snackBar.open('Successfully Logged out!','X', {
            duration: 2500,
          });
        }).catch(err => console.log(err));
      }
    }
  }
}
