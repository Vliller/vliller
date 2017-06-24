import { Injectable, Component } from '@angular/core';
import { ModalController, ViewController, Platform } from 'ionic-angular';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';
import { Device } from '@ionic-native/device';
import { AppVersion } from '@ionic-native/app-version';

@Injectable()
export class FeedbackFormService {
    constructor(
        private modalCtrl: ModalController
    ) {}

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

    private unRegisterBackButtonAction: any;

    constructor(
        private viewCtrl: ViewController,
        private http: Http,
        private platform: Platform
    ) {
        // Fix modal + sidemenu backbutton bug
        this.unRegisterBackButtonAction = platform.registerBackButtonAction(() => this.close(), 1);
    }

    public submit() {
        this.platform.ready()
            .then(() => new AppVersion().getVersionNumber())
            .then(version => {
                let device = new Device();

                this.sendRequest({
                    email: this.userFeedback.email,
                    message: this.userFeedback.message,
                    properties: {
                        version: version,
                        device: {
                            cordova: device.cordova,
                            model: device.model,
                            platform: device.platform,
                            version: device.version,
                            manufacturer: device.manufacturer
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
        this.unRegisterBackButtonAction();
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