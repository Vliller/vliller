import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';

import { VlilleStation } from '../../services/vlille/vlille';
import { FavoritesService } from '../../services/favorites/favorites';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard implements OnInit {
    private maxFavAlert;

    public station: VlilleStation = undefined;
    public isFavoriteStation: boolean = false;

    @Input('station') inputStation: Observable<VlilleStation>;

    constructor(
        private favoritesService: FavoritesService,
        private alertController: AlertController
    ) {
        // Alert to display when the user try to add more that MAX_FAV
        this.maxFavAlert = this.alertController.create({
            title: 'Vous avez atteint le nombre maximum de favoris',
            subTitle: 'Vous devez supprimer un favori existant pour pouvoir en créer un nouveau.',
            buttons: ['OK']
        });
    }

    ngOnInit() {
        this.inputStation.subscribe(station => {
            this.station = station;
            this.isFavoriteStation = this.favoritesService.contains(station);
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

            // max fav stations reached
            if (!this.isFavoriteStation) {
                this.maxFavAlert.present();
            }
        } else {
            this.isFavoriteStation = !this.favoritesService.remove(this.station);
        }
    }
}
