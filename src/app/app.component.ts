import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, Renderer2, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2){}
  darkMode: string;


  ngOnInit(){
    this.darkMode = JSON.parse(localStorage.getItem('dmode'));
    this.renderer.setAttribute(this.document.body, 'class', this.darkMode);
  }

  switchMode(isDarkMode: boolean){
    const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
    this.darkMode = isDarkMode ? 'theme-dark' : 'theme-light';
    this.renderer.setAttribute(this.document.body, 'class', hostClass);

    localStorage.setItem('dmode', JSON.stringify(this.darkMode))
  }

}
