import { Injectable, Component } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';

@Injectable()
export class FeedbackFormService {
    constructor(
        private modalCtrl: ModalController
    ) {}

    public showModal() {
        this.modalCtrl.create(FeedbackFrom).present();
    }
}

const FEEDBACK_API_URL = 'http://app.getsentry.com/api/0/projects/alex-et-manon/vliller/user-feedback/';
const FEEDBACK_API_TOKEN = 'fd7bb0c52cd246b0aad1acb7c482b6edce35f0750d7a494fa495cb606dc911f4';

@Component({
    templateUrl: 'feedback-form.html'
})
export class FeedbackFrom {
    public userFeedback: any = {};

    constructor(
        private viewCtrl: ViewController,
        private http: Http
    ) {}

    public submit() {
        let eventId = Raven.captureMessage('FeedbackFrom');

        this.sendRequest({
            "event_id": eventId,
            "email": this.userFeedback.email,
            "comments": this.userFeedback.message,
            "name": this.userFeedback.name
        })
        .catch(error => {
            // TODO: handle error
            console.error(error);

            return Observable.throw(error);
        })
        .subscribe(() => {
            this.close();
        });
    }

    public close() {
        this.viewCtrl.dismiss();
    }

    private sendRequest(data: any): Observable<Response> {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + FEEDBACK_API_TOKEN
        });
        let options = new RequestOptions({
            headers: headers
        });

        return this.http.post(FEEDBACK_API_URL, data, options)
    }
}