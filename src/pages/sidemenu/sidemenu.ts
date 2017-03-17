import { Component } from '@angular/core';
import { InAppBrowser, AppVersion, SocialSharing } from 'ionic-native';
import { Platform, ModalController } from 'ionic-angular';
import { About } from '../about/about';
// import * as Raven from 'raven-js';

import { AppSettings } from '../../app/app.settings';
import { FeedbackFormService } from '../../services/feedback-form/feedback-form';

@Component({
    selector: 'sidemenu',
    templateUrl: 'sidemenu.html'
})

export class Sidemenu {

    public appVersion: string;

    constructor(
        private platform: Platform,
        private modalCtrl: ModalController,
        private feedbackFormService: FeedbackFormService
    ) {
        this.platform.ready().then(() => {
            AppVersion.getVersionNumber().then(version => this.appVersion = version);
        });
    }

    /**
     * Open the app store page
     */
    public rateApp() {
        if (this.platform.is('android')) {
            new InAppBrowser('market://details?id=' + AppSettings.appId.android, '_system');
        } else if (this.platform.is('ios')) {
            new InAppBrowser('itms-apps://itunes.apple.com/fr/app/vliller/id' + AppSettings.appId.ios + '?mt=8', '_system');
        } else {
            console.error('Rate app - Unknow platform?!');
        }
    };

    /**
     *
     * @param {String} link
     */
    public openLink(link) {
        new InAppBrowser(link, '_system');
    };

    /**
     * Show bug report form
     */
    public openBugReport() {
        this.feedbackFormService.showModal();
    };

    /**
     * Show system social sharing to share the Vliller landing page.
     */
    public openSocialSharing() {
        SocialSharing.shareWithOptions({
            url: AppSettings.vlillerSiteUrl
        });
    };

    public openAboutPage() {
        this.modalCtrl.create(About, {
            appVersion: this.appVersion
        }).present();
    }
}