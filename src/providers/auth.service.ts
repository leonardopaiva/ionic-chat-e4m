import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';
import { BaseService } from "./base.service";

@Injectable()
export class AuthService extends BaseService {

  constructor(public afAuth: AngularFireAuth,
              public http: Http) {
    super();
    console.log('Hello AuthProvider Provider');
  }

  createAuthUser(user: {email: string, password: string}): firebase.Promise<firebase.User> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password)
      .catch(this.handlePromiseError);
  }

  signinWithEmail(user: {email: string, password: string}): firebase.Promise<boolean> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((authUser: firebase.User) => {
          return authUser != null;
      }).catch(this.handlePromiseError);
  }

  logout(): firebase.Promise<any> {
    return this.afAuth.auth.signOut();
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afAuth
        .authState
        .first()
        .subscribe((authUser: firebase.User) => {
          (authUser) ? resolve(true) : reject(false);
        });
    });
  }

}
