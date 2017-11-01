import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Platform } from 'ionic-angular';
import * as Raven from 'raven-js';

import { VlilleStation } from '../../models/vlille-station';

declare var launchnavigator: any;

@Component({
    selector: 'direction-button',
    template: `<button ion-button clear (click)="navigate()">ALLER<img class="img-responsive" src="assets/img/vliller-icon-direction.svg"></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DirectionButton {

    @Input() station: VlilleStation;

    private navigationApp: any;

    constructor(
        private launchNavigator: LaunchNavigator,
        private platform: Platform
    ) {
        platform.ready().then(() =>
            launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, isAvailable => {
                // priority to Google Maps app
                if (isAvailable){
                    this.navigationApp = launchnavigator.APP.GOOGLE_MAPS;
                } else {
                    // else, on Android, open native gep selector application
                    if (platform.is('android')) {
                        this.navigationApp = launchnavigator.APP.GEO;
                    }
                    // else, open app selector
                    else {
                        this.navigationApp = launchnavigator.APP.USER_SELECT;
                    }
                }
            })
        );
    }

    /**
     * Start navigation to the station
     */
    navigate() {
        this.platform.ready().then(() =>
            this.launchNavigator.navigate([
                this.station.latitude,
                this.station.longitude
            ], {
                app: this.navigationApp,
                destinationName: this.station.name,
                transportMode: 'walking',
                // launchMode: 'turn-by-turn',
                appSelection: {
                    dialogHeaderText: 'Sélectionnez une application de navigation',
                    cancelButtonText: 'Annuler'
                }
            })
            .catch(error => {
                // TODO: check if errors a relevant
                Raven.captureException(new Error(error));
            })
        );
    }
}