import {Component} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {VlilleStation} from '../../models/vlille-station';
import {FavoritesActions} from '../../actions/favorites';
import {Store} from '@ngrx/store';
import {AppState, selectFavorites} from '../../app/app.reducers';
import {map} from 'rxjs/operators';

/**
 * Generated class for the PagesFavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-pages-favorites',
    templateUrl: 'pages-favorites.html',
})
export class PagesFavoritesPage {

    public favoriteStations: VlilleStation[];

    constructor(public navParams: NavParams,
                private viewCtrl: ViewController,
                private store: Store<AppState>) {
        this.favoriteStations = navParams.get('favoriteStations');

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
        this.store.select(state => selectFavorites(state)).subscribe(stations => this.favoriteStations = stations);
    }

}
