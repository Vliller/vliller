import { Component } from '@angular/core';
import { ViewController, Platform, NavParams } from 'ionic-angular';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';
import { Device } from '@ionic-native/device';
import { AppSettings } from '../../app/app.settings';

@Component({
    templateUrl: 'feedback.html'
})
export class Feedback {
    public userFeedback: any = {};

    private appVersion: string;
    private unRegisterBackButtonAction: any;

    constructor(
        params: NavParams,
        private viewCtrl: ViewController,
        private http: Http,
        private platform: Platform,
        private devicePlugin: Device
    ) {
        this.appVersion = params.get('appVersion');

        // Fix modal + sidemenu backbutton bug
        this.unRegisterBackButtonAction = platform.registerBackButtonAction(() => this.close(), 1);
    }

    public submit() {
        this.platform
        .ready()
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

        return this.http.post(`${AppSettings.doorbell.apiBase}?key=${AppSettings.doorbell.apiKey}`, data, options)
    }
}