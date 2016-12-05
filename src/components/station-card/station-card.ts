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
     * Return a string format in meters or kilometers.
     *
     * @return {string}
     */
    public formatedDistance() {
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
