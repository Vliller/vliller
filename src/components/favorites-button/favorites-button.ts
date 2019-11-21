import {Component, Input, Output, ViewChild, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {FabContainer, ModalController} from 'ionic-angular';

import {VlilleStation} from '../../models/vlille-station';
import {PagesFavoritesPage} from '../../pages/pages-favorites/pages-favorites';

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
     * Emit an open/close event according to the isOpened state.
     */
    /*private emitOpenCloseEvent() {
        if (this.isOpened) {
            this.favoritesOpen.emit();
        } else {
            this.favoritesClose.emit();
        }
    }*/

    /**
     * Programmaticly closes the FAB and update open/close state.
     */
    /*public close() {
        this.fabContainer.close();
        this.isOpened = false;

        this.emitOpenCloseEvent();
    }*/

    /**
     * Open favorites modal
     */
    public openFavorites() {
        this.modalCtrl.create(PagesFavoritesPage,
            {favoriteStations: this.favoriteStations}
        ).present();
    }

    /**
     * Send the favoriteStationClick event and close the FAB.
     * @param {VlilleStation} station
     */
    /*public favoriteClick(station: VlilleStation) {
        this.favoriteStationClick.emit(station);
        this.close();
    }*/
}
