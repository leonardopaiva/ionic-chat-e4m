import { MenuController } from 'ionic-angular';
import { Chat } from './../../models/chat.model';
import { AuthService } from './../../providers/auth.service';
import { FirebaseListObservable } from 'angularfire2/database';
import { SignupPage } from './../signup/signup';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import firebase from 'firebase';

import { User } from './../../models/user.model';
import { UserService } from './../../providers/user.service';
import { ChatService } from './../../providers/chat.service';
import { ChatPage } from './../chat/chat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  chats: FirebaseListObservable<Chat[]>;
  users: FirebaseListObservable<User[]>;
  view: string = 'chats';

  constructor(public navCtrl: NavController,
    public userService: UserService,
    public authService: AuthService,
    public chatService: ChatService,
    public menuCtrl: MenuController) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {
    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any): void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatService.chats;
    this.users = this.userService.users;

    if (searchTerm) {

      switch (this.view) {
        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>>this.chats
            .map((chats: Chat[]) => chats.filter((chat: Chat) => (chat.title.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)));
          break;

        case 'users':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => users.filter((user: User) => (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)));
          break;
      }

    }
  }

  onChatCreate(recipientUser: User): void {
    console.log('User: ', recipientUser);

    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {

        this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)
          .first()
          .subscribe((chat: Chat) => {

            if (chat.hasOwnProperty('$value')) {
              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1 = new Chat('', timestamp, recipientUser.name, '');
              this.chatService.create(chat1, currentUser.$key, recipientUser.$key);

              let chat2 = new Chat('', timestamp, currentUser.name, '');
              this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
            }

          });
      });

    this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser
    })
  }

  onChatOpen(chat: Chat): void {

    let recipientUserId: string = chat.$key;

    this.userService.get(recipientUserId)
      .first()
      .subscribe((user: User) => {
        this.navCtrl.push(ChatPage, {
          recipientUser: user
        })
      });

  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }

}
