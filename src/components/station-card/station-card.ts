import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../../services/vlille/vlille';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard {

    @Input()
    public station: VlilleStation;

    @Input()
    public isLoaded: boolean = true;

    constructor() {}

    /**
     * Return a string format in meters or kilometers.
     *
     * @return {string}
     */
    public formatedDistance() {
        let distanceInMeter = (<any>this.station).distance,
            distanceString = 'à ';

        // to avoid blinking
        if (!distanceInMeter) {
            return '';
        }

        // meters
        if (distanceInMeter < 1000) {
            distanceString += Math.round(distanceInMeter) + 'm';
        }

        // kilometers
        else {
            distanceString += (Math.round(distanceInMeter / 100) / 10) + 'km';
        }

        return distanceString;
    };
}
