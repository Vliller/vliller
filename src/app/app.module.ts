import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app.component';
import { AppSettings } from './app.settings';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

// components
import { Map } from '../components/map/map';
import { StationCard } from '../components/station-card/station-card';
import { StationCardMetric } from '../components/station-card-metric/station-card-metric';
import { FavoritesButton } from '../components/favorites-button/favorites-button';
import { FavoritesAddIcon } from '../components/favorites-add-icon/favorites-add-icon';
import { LocationIcon } from '../components/location-icon/location-icon';
import { AetmFooter } from '../components/aetm-footer/aetm-footer';
import { ToastComponent } from '../services/toast/toast-component';
import { CbIcon } from '../components/cb-icon/cb-icon';
import { DirectionButton } from '../components/direction-button/direction-button';

// services
import { VlilleService } from '../services/vlille/vlille';
import { FavoritesService } from '../services/favorites/favorites';
import { LocationService } from '../services/location/location';
import { MapService } from '../services/map/map';
import { MarkersService } from '../services/map/markers';
import { FeedbackFormService, FeedbackFrom } from '../services/feedback-form/feedback-form';
import { ToastService } from '../services/toast/toast';

// pages
import { Home } from '../pages/home/home';
import { Sidemenu } from '../pages/sidemenu/sidemenu';
import { About } from '../pages/about/about';
import { Contribs } from '../pages/contribs/contribs';
import { CodeMemo } from '../pages/code-memo/code-memo';

// Sentry
import * as Raven from 'raven-js';

Raven.config(
    AppSettings.sentryDSN,
    {
        /**
         * Clear the path filename to allow Sentry to use map.js file
         *
         * @see https://gonehybrid.com/how-to-log-errors-in-your-ionic-2-app-with-sentry/
         */
        dataCallback: data => {
            if (data.culprit) {
                data.culprit = data.culprit.substring(data.culprit.lastIndexOf('/'));
            }

            var stacktrace = data.stacktrace || data.exception && data.exception.values[0].stacktrace;

            if (stacktrace) {
                stacktrace.frames.forEach(frame => {
                    frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
                });
            }
        }
    }
).install();

export class RavenErrorHandler implements ErrorHandler {
    handleError(err: any) : void {
        Raven.captureException(new Error(err.originalError));
    }
}

@NgModule({
    declarations: [
        App,
        Home,
        About,
        Contribs,
        Sidemenu,
        CodeMemo,
        Map,
        StationCard,
        StationCardMetric,
        FavoritesButton,
        FavoritesAddIcon,
        LocationIcon,
        FeedbackFrom,
        AetmFooter,
        ToastComponent,
        CbIcon,
        DirectionButton
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(App, {
            mode: "md"
        })
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
        Home,
        About,
        Contribs,
        FeedbackFrom,
        CodeMemo
    ],
    providers: [
        {
            provide: ErrorHandler,
            // useClass: IonicErrorHandler
            useClass: RavenErrorHandler
        },
        VlilleService,
        FavoritesService,
        LocationService,
        MapService,
        MarkersService,
        FeedbackFormService,
        ToastService,
        LaunchNavigator
    ]
})
export class AppModule {}
