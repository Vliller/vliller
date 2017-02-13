import { Injectable, Component } from '@angular/core';
import { Platform, ModalController, ViewController, NavParams } from 'ionic-angular';
import { AppVersion } from 'ionic-native';
import * as Raven from 'raven-js';

@Injectable()
export class FeedbackFormService {
    private appVersion: string;

    constructor(
        private platform: Platform,
        private modalCtrl: ModalController
    ) {
        this.platform.ready().then(() => {
            AppVersion.getVersionNumber().then(version => this.appVersion = version);
        });
    }

    public showModal() {
        this.modalCtrl.create(FeedbackFrom, {
            release: this.appVersion
        }).present();
    }
}

@Component({
    templateUrl: 'feedback-form.html'
})
export class FeedbackFrom {
    public appVersion: string;

    constructor(
        private viewCtrl: ViewController,
        private params: NavParams
    ) {
        this.appVersion = params.get('release');
    }

    public close() {
        this.viewCtrl.dismiss();
    }
}