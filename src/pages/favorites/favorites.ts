import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {VlilleStation} from '../../models/vlille-station';
import {FavoritesActions} from '../../actions/favorites';
import {Store} from '@ngrx/store';
import {AppState, selectFavorites} from '../../app/app.reducers';
import { Observable } from 'rxjs';
import {MapActions} from '../../actions/map';
import {MapPosition} from '../../models/map-position';
import {StationsActions} from '../../actions/stations';

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

    /**
     * Select station from favorites and center the map
     * @param station
     */
    selectFavorite(station: VlilleStation) {
        this.store.dispatch(new StationsActions.UpdateActive(station));
        this.store.dispatch(new MapActions.SetCenter(MapPosition.fromCoordinates(station)));
        this.viewCtrl.dismiss();
    }
}
