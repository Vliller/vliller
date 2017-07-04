import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app.component';
import { AppSettings } from './app.settings';
import { ravenInstall, RavenErrorHandler } from './raven';

// native
import { LaunchNavigator } from '@ionic-native/launch-navigator';

// ngrx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

// reducers
import { reducers } from './app.reducers';

// effects
import { FavoritesEffects } from '../effects/favorites';
import { ToastEffects } from '../effects/toast';
import { StationsEffects } from '../effects/stations';

// components
import { Map } from '../components/map/map';
import { StationCard } from '../components/station-card/station-card';
import { StationCardMetric } from '../components/station-card-metric/station-card-metric';
import { FavoritesButton } from '../components/favorites-button/favorites-button';
import { FavoritesAddIcon } from '../components/favorites-add-icon/favorites-add-icon';
import { LocationIcon } from '../components/location-icon/location-icon';
import { AetmFooter } from '../components/aetm-footer/aetm-footer';
import { ToastComponent } from '../components/toast/toast';
import { CbIcon } from '../components/cb-icon/cb-icon';
import { DirectionButton } from '../components/direction-button/direction-button';

// services
import { VlilleService } from '../services/vlille/vlille';
import { FavoritesService } from '../services/favorites/favorites';
import { LocationService } from '../services/location/location';
import { MapService } from '../services/map/map';
import { MarkersService } from '../services/map/markers';
import { FeedbackFormService, FeedbackFrom } from '../services/feedback-form/feedback-form';

// pages
import { Home } from '../pages/home/home';
import { Sidemenu } from '../pages/sidemenu/sidemenu';
import { About } from '../pages/about/about';
import { Contribs } from '../pages/contribs/contribs';
import { CodeMemo } from '../pages/code-memo/code-memo';

// active Sentry repporting during developpement
if (!AppSettings.isProduction) {
    ravenInstall(AppSettings.sentryDSN);
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
        }),
        StoreModule.provideStore(reducers),
        // Should be commented in production
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
        EffectsModule.run(FavoritesEffects),
        EffectsModule.run(ToastEffects),
        EffectsModule.run(StationsEffects),
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
            useClass: AppSettings.isProduction ? RavenErrorHandler : IonicErrorHandler
        },
        VlilleService,
        FavoritesService,
        LocationService,
        MapService,
        MarkersService,
        FeedbackFormService,
        LaunchNavigator
    ]
})
export class AppModule {}
