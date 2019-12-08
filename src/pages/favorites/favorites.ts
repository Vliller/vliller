import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {VlilleStation} from '../../models/vlille-station';
import {FavoritesActions} from '../../actions/favorites';
import {Store} from '@ngrx/store';
import {AppState, selectFavorites} from '../../app/app.reducers';
import { Observable } from 'rxjs';

@Component({
    selector: 'favorites',
    templateUrl: 'favorites.html',
})
export class Favorites {

    public favoriteStations: Observable<VlilleStation[]>;

    constructor(
        private viewCtrl: ViewController,
        private store: Store<AppState>
    ) {
        this.favoriteStations = this.store.select(state => selectFavorites(state));
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

    selectFavorite(station: VlilleStation) {
        // @todo
        console.debug('not implemented yet!')
    }
}
