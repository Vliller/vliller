import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { App } from './app.component';

// components
import { Map } from '../components/map/map';
import { StationCard } from '../components/station-card/station-card';
import { StationCardMetric } from '../components/station-card-metric/station-card-metric';
import { FavoritesButton } from '../components/favorites-button/favorites-button';
import { LocationIcon } from '../components/location-icon/location-icon';

// services
import { VlilleService } from '../services/vlille/vlille';
import { FavoritesService } from '../services/favorites/favorites';
import { LocationService } from '../services/location/location';
import { ToastService } from '../services/toast/toast';
import { MapService } from '../services/map/map';
import { MarkersService } from '../services/map/markers';

// pages
import { Home } from '../pages/home/home';
import { Sidemenu } from '../pages/sidemenu/sidemenu';

// Sentry
import * as Raven from 'raven-js';

Raven.config('https://0cdc4000f06146d58781cef186b88b4d@sentry.io/134393').install();

export class RavenErrorHandler implements ErrorHandler {
    handleError(err: any) : void {
        Raven.captureException(err.originalError);
    }
}

@NgModule({
    declarations: [
        App,
        Home,
        Sidemenu,
        Map,
        StationCard,
        StationCardMetric,
        FavoritesButton,
        LocationIcon
    ],
    imports: [
        HttpModule,
        IonicModule.forRoot(App, {
            mode: "md"
        }, {})
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
        Home
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
            // useClass: RavenErrorHandler
        },
        VlilleService,
        FavoritesService,
        LocationService,
        ToastService,
        MapService,
        MarkersService
    ]
})
export class AppModule {}
