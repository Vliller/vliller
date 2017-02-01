import { Component } from '@angular/core';
import { InAppBrowser, AppVersion, SocialSharing, Device } from 'ionic-native';
import { Platform } from 'ionic-angular';
import * as Raven from 'raven-js';

import { AppSettings } from '../../app/app.settings';

@Component({
    selector: 'sidemenu',
    templateUrl: 'sidemenu.html'
})

export class Sidemenu {

    public appVersion: string;

    constructor(public platform: Platform) {
        AppVersion.getVersionNumber().then(version => this.appVersion = version);
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
     * Show Instabug form
     */
    public openBugReport() {
        // defines some usefull properties
        (<any>window).doorbell.setProperty('version', this.appVersion);
        (<any>window).doorbell.setProperty('platform', Device);

        // open the box
        (<any>window).doorbell.show();

        // Sentry feedback dialog
        // Raven.showReportDialog({
        //     release: this.appVersion
        // });
    };

    /**
     * Show system social sharing to share the Vliller landing page.
     */
    public openSocialSharing() {
        SocialSharing.shareWithOptions({
            url: AppSettings.vlillerSiteUrl
        });
    };
}