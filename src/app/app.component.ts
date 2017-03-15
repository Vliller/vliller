import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, AppVersion, GoogleAnalytics } from 'ionic-native';
import * as Raven from 'raven-js';

// Add the RxJS Observable operators.
import './rxjs-operators';

import { Home } from '../pages/home/home';
import { AppSettings } from './app.settings';


@Component({
    templateUrl: 'app.html'
})
export class App {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = Home;

    pages: Array<{title: string, component: any}>;

    appVersion: string;

    constructor(public platform: Platform) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Manage status bar color
            if (this.platform.is('ios')) {
                StatusBar.styleLightContent();
            } else if (this.platform.is('android')) {
                StatusBar.backgroundColorByHexString('#b7212c');
            }

            // Get app version
            let versionPromise = AppVersion.getVersionNumber().then(version => {
                this.appVersion = version;

                // set version in error tracker
                Raven.setRelease(version);

                return version;
            });

            // Starts GA tracking
            let GAPromise = GoogleAnalytics.startTrackerWithId(AppSettings.googleAnalyticsId);

            // Configure GA (wait for app version)
            Promise
                .all([versionPromise, GAPromise])
                .then(data => GoogleAnalytics.setAppVersion(data[0]))
                .catch(error => Raven.captureException(error));
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
