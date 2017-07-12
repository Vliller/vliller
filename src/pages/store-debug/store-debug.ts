import { Component } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';

@Component({
    template: `
    <ion-header no-border>
        <ion-navbar>
            <ion-buttons end>
                <button ion-button icon-only (click)="close()">
                    <ion-icon color="primary" name="close"></ion-icon>
                </button>
            </ion-buttons>
        </ion-navbar>
    </ion-header>
    <ion-content class="no-scroll" fullscreen>
        <ngrx-store-log-monitor></ngrx-store-log-monitor>
    </ion-content>
    `
})
export class StoreDebugView {
    private unRegisterBackButtonAction: any;

    constructor(
        private viewCtrl: ViewController,
        private platform: Platform
    ) {
        // Fix modal + sidemenu backbutton bug
        this.unRegisterBackButtonAction = platform.registerBackButtonAction(() => this.close(), 1);
    }

    public close() {
        this.unRegisterBackButtonAction();
        this.viewCtrl.dismiss();
    }
}