import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { App } from './app.component';
import { AppSettings } from './app.settings';
import { ravenInstall, RavenErrorHandler } from './raven';

// native
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

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
import { ToastComponent } from '../components/toast/toast';
import { CbIcon } from '../components/cb-icon/cb-icon';
import { DirectionButton } from '../components/direction-button/direction-button';
import { PieChart } from '../components/pie-chart/pie-chart';

// services
import { VlilleService } from '../services/vlille-service';
import { VlilleServiceNative } from '../services/vlille-service-native';
import { LocationService } from '../services/location-service';
import { LocationServiceNative } from '../services/location-service-native';
import { FavoritesService } from '../services/favorites-service';

// pages
import { Home } from '../pages/home/home';
import { Sidemenu } from '../pages/sidemenu/sidemenu';
import { About } from '../pages/about/about';
import { Contribs } from '../pages/contribs/contribs';
import { CodeMemo } from '../pages/code-memo/code-memo';
import { Feedback } from '../pages/feedback/feedback';
import { Favorites } from '../pages/favorites/favorites';

// active Sentry repporting during production
if (AppSettings.isProduction) {
    ravenInstall(AppSettings.sentryDSN);
} else {
    console.log("Vliller is running in development mode");
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
        ToastComponent,
        CbIcon,
        DirectionButton,
        PieChart,
        Favorites
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        IonicModule.forRoot(App, {
            mode: "md"
        }),
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([
            FavoritesEffects,
            ToastEffects,
            StationsEffects,
            LocationEffects
        ]),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
        Home,
        About,
        Contribs,
        Feedback,
        CodeMemo,
        Favorites
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: AppSettings.isProduction ? RavenErrorHandler : IonicErrorHandler
        },
        {
            provide: VlilleService,
            useClass: VlilleServiceNative
        },
        {
            provide: LocationService,
            useClass: LocationServiceNative
        },
        FavoritesService,
        LaunchNavigator,
        AppVersion,
        InAppBrowser,
        DeviceOrientation,
        Device,
        SplashScreen,
        SocialSharing,
        Geolocation,
        Diagnostic,
        LocationAccuracy,
        StatusBar,
        HTTP,
        GoogleAnalytics
    ]
})
export class AppModule {}
