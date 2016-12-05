import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStationDetails } from '../vlille/vlille';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard implements OnInit {
    public stationDetails: VlilleStationDetails;

    @Input() station: Observable<VlilleStationDetails>;

    constructor() {}

    ngOnInit() {
        this.station.subscribe((station: VlilleStationDetails) => this.stationDetails = station);
    }

    /**
     * Compute css class according to the given number.
     * 0        : red,
     * ]0, 5]   : orange,
     * ]5, inf[ : green
     *
     * @param  Number number
     * @return String
     */
    public computeColorClass (number: number) {
        if (number === 0) {
            return 'assertive';
        }

        if (number <= 5) {
            return 'energized';
        }

        return 'calm';
    };

    public computeBikesIcon (number: number) {
        if (number === 0) {
            return 'assets/img/vliller_bike-red.png';
        }

        if (number <= 5) {
            return 'assets/img/vliller_bike-orange.png';
        }

        return 'assets/img/vliller_bike-green.png';
    };

    public computeDocksIcon (number: number) {
        if (number === 0) {
            return 'assets/img/vliller_place-red.png';
        }

        if (number <= 5) {
            return 'assets/img/vliller_place-orange.png';
        }

        return 'assets/img/vliller_place-green.png';
    };

    /**
     * Return a string format in meters or kilometers.
     *
     * @return String
     */
    public formatedDistance () {
        // var distanceInMeter = activeMarker.get('distance'),
        //     distanceString = 'à ';

        // // meters
        // if (distanceInMeter < 1000) {
        //     distanceString += Math.round(distanceInMeter) + 'm';
        // }

        // // kilometers
        // // @see http://www.jacklmoore.com/notes/rounding-in-javascript/
        // else {
        //     distanceString += Number(Math.round((distanceInMeter / 1000) + 'e1') + 'e-1') + 'km';
        // }

        // return distanceString;
    };
}
