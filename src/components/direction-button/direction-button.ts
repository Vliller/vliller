import { Component, Input } from '@angular/core';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import * as Raven from 'raven-js';

@Component({
    selector: 'direction-button',
    templateUrl: './direction-button.html'
})

export class DirectionButton {

    @Input() coordinates: any;

    constructor(private launchNavigator: LaunchNavigator) {}

    startNavigation() {
        this.launchNavigator.navigate(
            [
                this.coordinates.latitude,
                this.coordinates.longitude
            ],
            {
                transportMode: 'walking',
                // appSelectionDialogHeader: 'Sélectionnez une application de navigation',
                // appSelectionCancelButton: 'Annuler'
            }
        ).catch(error => {
            Raven.captureException(new Error(error));
        });
    }
}