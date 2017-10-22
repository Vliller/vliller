import { Component } from '@angular/core';
import { ViewController, Platform, NavParams } from 'ionic-angular';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';
import { Device } from '@ionic-native/device';

const FEEDBACK_API_URL = 'https://doorbell.io/api/applications/4561/submit';
const FEEDBACK_API_TOKEN = 'g9xKf3v4aM29diiMXJVh2Ko9J54fEaQ6uCqysESJSf8WWaKIcXwmVBXT94rXF8Lr';

@Component({
    templateUrl: 'feedback.html'
})
export class Feedback {
    public userFeedback: any = {};

    private appVersion: string;
    private unRegisterBackButtonAction: any;

    constructor(
        private viewCtrl: ViewController,
        private params: NavParams,
        private http: Http,
        private platform: Platform,
        private devicePlugin: Device
    ) {
        this.appVersion = params.get('appVersion');

        // Fix modal + sidemenu backbutton bug
        this.unRegisterBackButtonAction = platform.registerBackButtonAction(() => this.close(), 1);
    }

    public submit() {
        this.platform.ready()
            .then(() => {
                this.sendRequest({
                    email: this.userFeedback.email,
                    message: this.userFeedback.message,
                    properties: {
                        version: this.appVersion,
                        device: {
                            cordova: this.devicePlugin.cordova,
                            model: this.devicePlugin.model,
                            platform: this.devicePlugin.platform,
                            version: this.devicePlugin.version,
                            manufacturer: this.devicePlugin.manufacturer
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