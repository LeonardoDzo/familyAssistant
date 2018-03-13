import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'app/shared/models/user';
import { Event } from 'app/shared/models/event';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class EventService {
	assistant: User;
	sub: Subscription;
	constructor(
	  	private afa: AngularFireAuth,
	    private afd: AngularFireDatabase
	) { 
		this.sub = this.getUser().subscribe((user: User) => {
			this.assistant = user;
		}, error => {

		})
	}

	destroy() {
		this.sub.unsubscribe();
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
	
	private addEventToUser(eventId: string, userId: string) {
		this.afd.database.ref(`users/${userId}/events/${eventId}`).push(true)
	}

	addEvent(event: Event) {
		this.afd.database.ref("events/").push(event).then(ref => {
			ref.update({
				id: ref.key
			})
			let membersIds = Object.keys(event.members)

			membersIds.forEach(id => {
				this.addEventToUser(ref.key,id)
			})

		})
	}
}
