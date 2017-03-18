import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})

export class About {
    public contributorsLoaded: boolean = false;
    public appVersion: string;

    constructor(
        private viewCtrl: ViewController,
        private params: NavParams
    ) {
        this.appVersion = params.get('appVersion');
    }

    public close() {
        this.viewCtrl.dismiss();
    }
}