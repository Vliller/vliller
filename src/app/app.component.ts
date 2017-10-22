import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

import * as Raven from 'raven-js';

// Add the RxJS Observable operators.
import './rxjs-operators';

import { Home } from '../pages/home/home';
import { AppSettings } from './app.settings';

declare var Appsee: any;

@Component({
    templateUrl: 'app.html'
})
export class App {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = Home;

    pages: Array<{title: string, component: any}>;

    appVersion: string;

    constructor(
        private platform: Platform,
        private appVersionPlugin: AppVersion
    ) {
        this.platform.ready().then(() => {
            // Get app version
            let versionPromise = appVersionPlugin.getVersionNumber().then(version => {
                this.appVersion = version;

                // set version in error tracker
                Raven.setRelease(version);

                return version;
            });

            if (AppSettings.isProduction) {
                // Starts AppSee tracking
                Appsee.start(AppSettings.appSeeId);
            }
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}