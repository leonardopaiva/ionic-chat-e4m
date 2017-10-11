import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { HomePage } from '../pages/home/home';
import { MessageService } from './../providers/message.service';
import { ChatPage } from './../pages/chat/chat';
import { PipesModule } from './../pipes/pipes.module';
import { ComponentsModule } from './../components/components.module';
import { SigninPage } from './../pages/signin/signin';
import { SignupPage } from './../pages/signup/signup';
import { UserProfilePage } from './../pages/user-profile/user-profile';

import { environment } from '../environments/environment';
import { UserService } from './../providers/user.service';
import { AuthService } from './../providers/auth.service';
import { ChatService } from './../providers/chat.service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    ChatPage,
    UserProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ComponentsModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    SigninPage,
    ChatPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserService,
    AuthService,
    ChatService,
    MessageService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
