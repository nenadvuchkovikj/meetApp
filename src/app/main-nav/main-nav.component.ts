import { Component, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {AngularFireAuth} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {

  @Output() readonly modeSwitched = new EventEmitter<boolean>();
  darkMode:string = JSON.parse(localStorage.getItem('dmode'));
  switcher:boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(){
    if(this.darkMode === 'theme-dark'){
      this.switcher = true;
    }
  }

  constructor(private breakpointObserver: BreakpointObserver,
              private auth: AngularFireAuth,
              private router: Router
    ) {}

  onDarkModeSwitched({ checked }: MatSlideToggleChange){
    this.modeSwitched.emit(checked);
  }
  onLogout(){
    this.auth.signOut().then(() => this.router.navigate(['login']));
  }
}
