import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { App } from './app.component';
import { AppSettings } from './app.settings';
import { ravenInstall, RavenErrorHandler } from './raven';

// native
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DeviceOrientation } from '@ionic-native/device-orientation';
import { Device } from '@ionic-native/device';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { StatusBar } from '@ionic-native/status-bar';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// reducers
import { reducers } from './app.reducers';

// effects
import { FavoritesEffects } from '../effects/favorites';
import { ToastEffects } from '../effects/toast';
import { StationsEffects } from '../effects/stations';
import { LocationEffects } from '../effects/location';

// components
import { MapComponent } from '../components/map/map';
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
import { VlilleService } from '../services/vlille';
import { FavoritesService } from '../services/favorites';
import { LocationService } from '../services/location';
import { MapService } from '../services/map';

// pages
import { Home } from '../pages/home/home';
import { Sidemenu } from '../pages/sidemenu/sidemenu';
import { About } from '../pages/about/about';
import { Contribs } from '../pages/contribs/contribs';
import { CodeMemo } from '../pages/code-memo/code-memo';
import { Feedback } from '../pages/feedback/feedback';

// active Sentry repporting during production
if (AppSettings.isProduction) {
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
        MapComponent,
        StationCard,
        StationCardMetric,
        FavoritesButton,
        FavoritesAddIcon,
        LocationIcon,
        Feedback,
        AetmFooter,
        ToastComponent,
        CbIcon,
        DirectionButton
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        IonicModule.forRoot(App, {
            mode: "md"
        }),
        StoreModule.provideStore(reducers),
        EffectsModule.run(FavoritesEffects),
        EffectsModule.run(ToastEffects),
        EffectsModule.run(StationsEffects),
        EffectsModule.run(LocationEffects)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
        Home,
        About,
        Contribs,
        Feedback,
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
        LaunchNavigator,
        AppVersion,
        InAppBrowser,
        DeviceOrientation,
        Device,
        SplashScreen,
        SocialSharing,
        NativeStorage,
        Geolocation,
        Diagnostic,
        LocationAccuracy,
        StatusBar
    ]
})
export class AppModule {}
