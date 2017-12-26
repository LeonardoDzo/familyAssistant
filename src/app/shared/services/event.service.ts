import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'app/shared/models/user';

@Injectable()
export class EventService {
	assistant: User;
	constructor(
	  	private afa: AngularFireAuth,
	    private afd: AngularFireDatabase
	) { 
		this.getUser().subscribe((user: User) => {
			this.assistant = user;
		})
	}

	getUser() {
		let uid = this.afa.auth.currentUser.uid;
		return this.afd.object(`assistants/${uid}`).valueChanges();
	}

	getEvents() {
		let uid = this.assistant.selectedBoss;
		return this.afd.list(`users/${uid}/events`).snapshotChanges()
	}

	getEvent(key: string) {
		return this.afd.database.ref(`events/${key}`).once('value')
	}
}
