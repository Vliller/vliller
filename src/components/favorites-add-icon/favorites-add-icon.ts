import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { VlilleStation } from '../../models/vlillestation';

import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.reducers';
import { FavoritesActions } from '../../actions/favorites';

@Component({
    selector: 'favorites-add-icon',
    templateUrl: './favorites-add-icon.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FavoritesAddIcon {
    @Input() station: VlilleStation;

    constructor(private store: Store<AppState>) {}

    /**
     * Updates favorites service and star icon
     */
    public toggleFavorite() {
        this.station.isFavorite = !this.station.isFavorite;

        if (this.station.isFavorite) {
            this.store.dispatch(new FavoritesActions.Add(this.station));
        } else {
            this.store.dispatch(new FavoritesActions.Remove(this.station));
        }
    }
}