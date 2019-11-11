import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { AppSettings } from './app.settings';

import * as Raven from 'raven-js';

// Add the RxJS Observable operators.
import './rxjs-operators';

import { Home } from '../pages/home/home';

@Component({
    templateUrl: 'app.html'
})
export class App {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = Home;

    pages: Array<{title: string, component: any}>;

    appVersion: string;

    constructor(
        platform: Platform,
        appVersionPlugin: AppVersion,
        statusBarPlugin: StatusBar,
        googleAnalyticsPlugin: GoogleAnalytics
    ) {
        platform.ready().then(() => {
            // Get app version
            appVersionPlugin.getVersionNumber()
            .then(version => {
                this.appVersion = version;

                // set version in error tracker
                Raven.setRelease(version);

                return version;
            })
            // run Analytics
            .then(version => {
                if (AppSettings.isProduction) {
                    googleAnalyticsPlugin.startTrackerWithId(AppSettings.googleAnalyticsId)
                    .then(() => {
                        googleAnalyticsPlugin.setAppVersion(version);
                        googleAnalyticsPlugin.setAnonymizeIp(true);
                    })
                    .catch(error => Raven.captureException(new Error(error)));
                }
            });
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}