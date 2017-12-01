import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VlilleStation } from '../../models/vlille-station';
import { Store } from '@ngrx/store';
import { AppState, selectFavorites } from '../../app/app.reducers';
import { FavoritesActions } from '../../actions/favorites';

@Component({
    selector: 'page-favorites',
    templateUrl: 'favorites.html'
})
export class FavoritesPage {
  public favoriteStations: Observable<VlilleStation[]>;

  constructor(
    private store: Store<AppState>
  ) {
    this.favoriteStations = store.select(state => selectFavorites(state));
  }

  remove(station: VlilleStation) {
    this.store.dispatch(new FavoritesActions.Remove(station));
  }
}