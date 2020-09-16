import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
     private fb: FormBuilder,
     private auth: AngularFireAuth,
     private router: Router,
     private _snackBar: MatSnackBar,
     ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onLogin(){
    const {email, password} = this.loginForm.value;
    this.auth.signInWithEmailAndPassword(email, password).then( () => {
      this.router.navigate(['']);
      this._snackBar.open('Successfully Logged in','X', {
        duration: 2500,
      });
    }).catch(err =>{
      this._snackBar.open(err.message, 'X', {
        duration: 2000,
        panelClass: ['warning']
      });
    });
  }

}
