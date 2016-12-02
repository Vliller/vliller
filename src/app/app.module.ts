import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { App } from './app.component';

// components
import { Map } from '../components/map/map';
import { StationCard } from '../components/station-card/station-card';
import { VlilleService } from '../components/vlille/vlille';

// pages
import { Home } from '../pages/home/home';


@NgModule({
    declarations: [
        App,
        Home,
        Map,
        StationCard
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
        VlilleService
    ]
})
export class AppModule {}
