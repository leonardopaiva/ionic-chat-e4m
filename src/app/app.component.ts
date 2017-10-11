import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SigninPage } from './../pages/signin/signin';
import { UserService } from './../providers/user.service';
import { AuthService } from './../providers/auth.service';

import { User } from './../models/user.model';

import * as firebase from 'firebase/app';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SigninPage;
  currentUser: User;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    authService: AuthService, //caso nao seja declarado como private ou public,
                                      // o authService so podera ser usado no construtor
    userService: UserService
  ) {

    authService
      .afAuth
      .authState
      .subscribe((authUser: firebase.User) => {

        if (authUser) {

          //this.rootPage = HomePage;

          userService.currentUser
            .subscribe((user: User) => {
              this.currentUser = user;
            });

        } else {

          //this.rootPage = SigninPage;

        }

      });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

