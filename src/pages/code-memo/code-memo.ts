import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
import * as Raven from 'raven-js';

@Component({
    selector: 'page-code-memo',
    templateUrl: 'code-memo.html'
})

export class CodeMemo {
    code: string;

    constructor(
        private viewCtrl: ViewController,
        private platform: Platform
    ) {
        // STUMB
        this.code = "____";
    }

    close() {
        this.viewCtrl.dismiss();
    }
}