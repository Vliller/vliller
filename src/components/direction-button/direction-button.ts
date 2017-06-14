import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Platform } from 'ionic-angular';
import * as Raven from 'raven-js';

import { VlilleStation } from '../../services/vlille/vlille';

declare var launchnavigator: any;

@Component({
    selector: 'direction-button',
    templateUrl: './direction-button.html'
})

export class DirectionButton {

    @Input() station: VlilleStation;

    private navigationApp: any;

    constructor(
        private launchNavigator: LaunchNavigator,
        private platform: Platform
    ) {
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
        });
    }

    /**
     * Start navigation to the station
     */
    navigate() {
        this.launchNavigator.navigate(
            [
                this.station.latitude,
                this.station.longitude
            ],
            {
                app: this.navigationApp,
                destinationName: this.station.name,
                transportMode: 'walking',
                // launchMode: 'turn-by-turn',
                appSelectionDialogHeader: 'Sélectionnez une application de navigation',
                appSelectionCancelButton: 'Annuler'
            }
        )
        .catch(error => {
            // TODO: check if errors a relevant
            Raven.captureException(new Error(error));
        });
    }
}