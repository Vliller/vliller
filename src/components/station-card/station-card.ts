import { Component, Input, OnInit, ApplicationRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../vlille/vlille';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard implements OnInit {
    public station: VlilleStation = undefined;
    public isStationFavorite: boolean;

    @Input('station') inputStation: Observable<VlilleStation>;

    constructor(private applicationRef: ApplicationRef) {
        // TODO
        this.isStationFavorite = false;
    }

    ngOnInit() {
        this.inputStation.subscribe(station => {
            this.station = station;

            // DIRTY (FORCE TEMPLATE TO RERENDER)
            this.applicationRef.tick();
        });
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
