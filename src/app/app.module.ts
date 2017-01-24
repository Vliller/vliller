import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { App } from './app.component';

// components
import { Map } from '../components/map/map';
import { StationCard } from '../components/station-card/station-card';
import { StationCardMetric } from '../components/station-card-metric/station-card-metric';
import { FavoritesButton } from '../components/favorites-button/favorites-button';

// services
import { VlilleService } from '../services/vlille/vlille';
import { FavoritesService } from '../services/favorites/favorites';
import { LocationService } from '../services/location/location';
import { ToastService } from '../services/toast/toast';
import { MapService } from '../services/map/map';

// pages
import { Home } from '../pages/home/home';


@NgModule({
    declarations: [
        App,
        Home,
        Map,
        StationCard,
        StationCardMetric,
        FavoritesButton
    ],
    imports: [
        HttpModule,
        IonicModule.forRoot(App)
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
        },
        VlilleService,
        FavoritesService,
        LocationService,
        ToastService,
        MapService
    ]
})
export class AppModule {}
