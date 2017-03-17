import { Injectable, Component } from '@angular/core';
import { ModalController, ViewController, Platform } from 'ionic-angular';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';
import { Device, AppVersion } from 'ionic-native';

@Injectable()
export class FeedbackFormService {
    constructor(
        private modalCtrl: ModalController
    ) {

    }

    public showModal() {
        this.modalCtrl.create(FeedbackFrom).present();
    }
}

const FEEDBACK_API_URL = 'https://doorbell.io/api/applications/4561/submit';
const FEEDBACK_API_TOKEN = 'g9xKf3v4aM29diiMXJVh2Ko9J54fEaQ6uCqysESJSf8WWaKIcXwmVBXT94rXF8Lr';

@Component({
    templateUrl: 'feedback-form.html'
})
export class FeedbackFrom {
    public userFeedback: any = {};

    constructor(
        private viewCtrl: ViewController,
        private http: Http,
        private platform: Platform
    ) {}

    public submit() {
        this.platform.ready()
            .then(() => AppVersion.getVersionNumber())
            .then(version => {
            this.sendRequest({
                email: this.userFeedback.email,
                message: this.userFeedback.message,
                properties: {
                    version: version,
                    device: {
                        cordova: Device.cordova,
                        model: Device.model,
                        platform: Device.platform,
                        version: Device.version,
                        manufacturer: Device.manufacturer
                    }
                }
            })
            .catch(error => {
                Raven.captureException(new Error(error));

                return Observable.throw(error);
            })
            .subscribe(() => {
                this.close();
            });
        });
    }

    public close() {
        this.viewCtrl.dismiss();
    }

    private sendRequest(data: any): Observable<Response> {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
            headers: headers
        });

        return this.http.post(FEEDBACK_API_URL + '?key=' + FEEDBACK_API_TOKEN, data, options)
    }
}