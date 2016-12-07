import { Component, Input, Output, OnInit, ApplicationRef, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../../services/vlille/vlille';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard implements OnInit {
    public station: VlilleStation = undefined;
    public isFavoriteStation: boolean;

    @Input('station') inputStation: Observable<VlilleStation>;
    @Output() isFavoriteStationChange = new EventEmitter<boolean>();

    constructor(private applicationRef: ApplicationRef) {
        // TODO
        this.isFavoriteStation = false;
    }

    ngOnInit() {
        this.inputStation
        .sampleTime(300)
        .subscribe(station => {
            this.station = station;

            // DIRTY (FORCE TEMPLATE TO RERENDER)
            // @see http://stackoverflow.com/a/36064593/5727772
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
        this.isFavoriteStation = !this.isFavoriteStation;

        // send event to inform other components
        this.isFavoriteStationChange.emit(this.isFavoriteStation)
    }
}
