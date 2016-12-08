import { Component, Input, OnInit, ApplicationRef, style, animate, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../../services/vlille/vlille';
import { FavoritesService } from '../../services/favorites/favorites';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html',

    // @see http://stackoverflow.com/a/39356145/5727772
    animations: [
        trigger('delayFadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('500ms 200ms', style({ opacity: 1 }))
            ]),

        ]),
        trigger('delayOut', [
            transition(':leave', [
                animate('500ms 0', style({ opacity: 0 }))
            ]),
        ])
    ]
})

export class StationCard implements OnInit {
    public station: VlilleStation = undefined;
    public isFavoriteStation: boolean = false;

    @Input('station') inputStation: Observable<VlilleStation>;

    constructor(
        private applicationRef: ApplicationRef,
        private favoritesService: FavoritesService
    ) {}

    ngOnInit() {
        this.inputStation.subscribe(station => {
            this.station = station;
            this.isFavoriteStation = this.favoritesService.contains(station);

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
