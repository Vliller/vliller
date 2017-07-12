import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { VlilleStation } from '../../models/vlillestation';

import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.reducers';
import { FavoritesActions } from '../../actions/favorites';

@Component({
    selector: 'favorites-add-icon',
    template: `
        <button ion-button clear (click)="toggleFavorite()">
            <img *ngIf="station.isFavorite" class="img-responsive" src="assets/img/vliller-icon-fav-added.svg">
            <img *ngIf="!station.isFavorite" class="img-responsive" src="assets/img/vliller-icon-fav-add.svg">
        </button>
    `,
    styles: [`
        :host {
            display: block;
        }

        .button {
            margin: 0;
            padding: 0 1rem;
        }
    `],
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