import {Component, Input, Output, ViewChild, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {FabContainer, ModalController} from 'ionic-angular';

import {VlilleStation} from '../../models/vlille-station';
import {Favorites} from '../../pages/favorites/favorites';

@Component({
    selector: 'favorites-button',
    templateUrl: './favorites-button.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FavoritesButton {
    @ViewChild('fab') fabContainer: FabContainer;

    @Input() favoriteStations: VlilleStation[];
    @Output() favoriteStationClick = new EventEmitter<VlilleStation>();

    private isOpened: boolean = false;
    @Output() favoritesOpen = new EventEmitter<any>();
    @Output() favoritesClose = new EventEmitter<any>();

    constructor(private modalCtrl: ModalController) {
    }

    /**
     * Open favorites modal
     */
    public openFavorites() {
        this.modalCtrl.create(Favorites,
            {favoriteStations: this.favoriteStations}
        ).present();
    }

}
