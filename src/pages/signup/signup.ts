import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AlertController, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { UserService } from "../../providers/user.service";
import { AuthService } from "../../providers/auth.service";

import 'rxjs/add/operator/first';

import * as firebase from 'firebase/app';

// import { FirebaseAuthState } from 'angularfire2';

// import { AuthService } from './../../providers/auth.service';
// import { User } from './../../models/user.model';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;

  constructor(
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService,
    public authService: AuthService,
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  onSubmit(): void {

    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username: string = formUser.username;

    this.userService.userExists(username)
      .first()
      .subscribe((userExists: boolean) => {
        if (!userExists) {
          this.authService.createAuthUser(
            {
              email: formUser.email,
              password: formUser.password
            }
          ).then((authState: firebase.User) => {

            delete formUser.password;
            let uuid: string = authState.uid;

            this.userService.create(formUser, uuid)
              .then(() => {
                console.log('Usuario cadastrado!');
                this.navCtrl.setRoot(HomePage);
                loading.dismiss();
              }).catch((error: any) => {
                console.log(error);
                loading.dismiss();
                this.showAlert(error);
              });
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          })
        } else {
          this.showAlert(`O username ${username} já está sendo usado em outra conta!`)
          loading.dismiss();
        }

      });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

}
