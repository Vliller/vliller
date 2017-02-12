import { Component, Input, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation, VlilleStationResume, VlilleService } from '../../services/vlille/vlille';
import { FavoritesService } from '../../services/favorites/favorites';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard implements OnInit {
    public station: VlilleStation = undefined;
    public isFavoriteStation: boolean = false;

    @Input('station') inputStation: Observable<VlilleStationResume>;

    constructor(
        private favoritesService: FavoritesService,
        private zone: NgZone,
        private vlilleService: VlilleService
    ) {}

    ngOnInit() {
        this.inputStation.subscribe(stationResume => {
            // active loader animation
            this.station = undefined;

            // put the service request inside the NgZone to perform automatic view update
            // @see http://stackoverflow.com/a/37028716/5727772
            this.zone.run(() => {
                // get station details
                this.vlilleService.getStation(stationResume.id).subscribe(stationDetails => {
                        let station = VlilleStation.createFromResumeAndDetails(stationResume, stationDetails);

                        // updates privates attributes
                        this.station = station;
                        this.isFavoriteStation = this.favoritesService.contains(station);
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

    /**
     * Updates favorites service and star icon
     */
    public toggleFavorite() {
        this.isFavoriteStation = !this.isFavoriteStation;

        if (this.isFavoriteStation) {
            this.isFavoriteStation = this.favoritesService.add(this.station);
        } else {
            this.isFavoriteStation = !this.favoritesService.remove(this.station);
        }
    }
}
