import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {VlilleStation} from '../../models/vlille-station';
import {FavoritesActions} from '../../actions/favorites';
import {Store} from '@ngrx/store';
import {AppState, selectFavorites} from '../../app/app.reducers';

@Component({
    selector: 'favorites',
    templateUrl: 'favorites.html',
})
export class Favorites {

    public favoriteStations: VlilleStation[];

    constructor(
        private viewCtrl: ViewController,
        private store: Store<AppState>
    ) {
        this.store
            .select(state => selectFavorites(state))
            .subscribe(stations =>
                this.favoriteStations = stations
            );
    }

    /**
     * Close modal
     */
    close() {
        this.viewCtrl.dismiss();
    }

    /**
     * Remove station from favorites
     * @param station
     */
    removeFavorite(station: VlilleStation) {
        station.isFavorite = !station.isFavorite;

        this.store.dispatch(new FavoritesActions.Remove(station));
    }

}
