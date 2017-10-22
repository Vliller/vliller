import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StatusBar } from '@ionic-native/status-bar';
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

    constructor(private platform: Platform) {
        this.platform.ready().then(() => {
            let statusBar = new StatusBar();

            // Manage status bar color
            if (this.platform.is('ios')) {
                statusBar.styleLightContent();
            } else if (this.platform.is('android')) {
                statusBar.backgroundColorByHexString('#b7212c');
            }

            // Get app version
            let versionPromise = new AppVersion().getVersionNumber().then(version => {
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