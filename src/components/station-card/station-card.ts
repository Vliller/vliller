import { Component, Input, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation, VlilleService } from '../../services/vlille/vlille';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard implements OnInit {
    public station: VlilleStation = undefined;
    public isLoaded: boolean = false;

    @Input('station') inputStation: Observable<VlilleStation>;

    constructor(
        private zone: NgZone,
        private vlilleService: VlilleService
    ) {}

    ngOnInit() {
        this.inputStation.subscribe(station => {
            // active loader animation
            this.isLoaded = false;

            // put the service request inside the NgZone to perform automatic view update
            // @see http://stackoverflow.com/a/37028716/5727772
            this.zone.run(() => {
                // get station details
                this.vlilleService.getStation(station.id).subscribe(freshStation => {
                        // updates privates attributes
                        this.station = freshStation;

                        this.isLoaded = true;
                    }
                );
            });
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
}
