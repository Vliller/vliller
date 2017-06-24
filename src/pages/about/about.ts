import { Component } from '@angular/core';
import { ViewController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})

export class About {
    public contributorsLoaded: boolean = false;
    public appVersion: string;

    private unRegisterBackButtonAction: any;

    constructor(
        private viewCtrl: ViewController,
        private params: NavParams,
        private platform: Platform
    ) {
        this.appVersion = params.get('appVersion');

        // Fix modal + sidemenu backbutton bug
        this.unRegisterBackButtonAction = platform.registerBackButtonAction(() => this.close(), 1);
    }

    public close() {
        this.unRegisterBackButtonAction();
        this.viewCtrl.dismiss();
    }

    public openLink(link) {
        new InAppBrowser().create(link, '_system');
    }
}