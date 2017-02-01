import { Component } from '@angular/core';
import { InAppBrowser, AppVersion, SocialSharing } from 'ionic-native';
import { Platform } from 'ionic-angular';

const ANDROID_APP_ID = 'com.alexetmanon.vliller';
const IOS_APP_ID = '1161025016';
const VLILLER_SITE_URL = 'http://vliller.alexetmanon.com';

@Component({
    selector: 'sidemenu',
    templateUrl: 'sidemenu.html'
})

export class Sidemenu {

    public appVersion;

    constructor(public platform: Platform) {
        AppVersion.getVersionNumber().then(version => this.appVersion = version);
    }

    /**
     * Open the app store page
     */
    public rateApp() {
        if (this.platform.is('android')) {
            new InAppBrowser('market://details?id=' + ANDROID_APP_ID, '_system');
        } else if (this.platform.is('ios')) {
            new InAppBrowser('itms-apps://itunes.apple.com/fr/app/vliller/id' + IOS_APP_ID + '?mt=8', '_system');
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
     * TODO
     * Show Instabug form
     */
    public openBugReport() {
        // // defines some usefull properties
        // window.doorbell.setProperty('version', $rootScope.appVersion);
        // window.doorbell.setProperty('platform', ionic.Platform.device());

        // // open the box
        // window.doorbell.show();
    };

    /**
     * Show system social sharing to share the Vliller landing page.
     */
    public openSocialSharing() {
        SocialSharing.shareWithOptions({
            url: VLILLER_SITE_URL
        });
    };
}