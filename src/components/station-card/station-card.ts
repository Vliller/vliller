import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../vlille/vlille';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard implements OnInit {
    public stationDetails: VlilleStation;
    public isStationFavorite: boolean;

    @Input() station: Observable<VlilleStation>;

    constructor() {
        // TODO
        this.isStationFavorite = false
    }

    ngOnInit() {
        this.station.subscribe((station: VlilleStation) => this.stationDetails = station);
    }

    /**
     * Return a string format in meters or kilometers.
     *
     * @return {string}
     */
    public formatedDistance() {
        // TODO
        return '400m';

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

    public toggleFavorite() {
        // TODO
        this.isStationFavorite = !this.isStationFavorite;
        console.log(this.isStationFavorite)
    }
}
