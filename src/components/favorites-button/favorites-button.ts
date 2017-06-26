import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FabContainer } from 'ionic-angular';

import { VlilleStation } from '../../services/vlille/vlille';

@Component({
    selector: 'favorites-button',
    templateUrl: './favorites-button.html'
})

export class FavoritesButton {
    @ViewChild('fab') fabContainer: FabContainer;

    @Input() favoriteStations: VlilleStation[];
    @Output() favoriteStationClick = new EventEmitter<VlilleStation>();

    private isOpened: boolean = false;
    @Output() favoritesOpen = new EventEmitter<any>();
    @Output() favoritesClose = new EventEmitter<any>();

    /**
     * Emit an open/close event according to the isOpened state.
     */
    private emitOpenCloseEvent() {
        if (this.isOpened) {
            this.favoritesOpen.emit();
        } else {
            this.favoritesClose.emit();
        }
    }

    /**
     * Programmaticly closes the FAB and update open/close state.
     */
    public close() {
        this.fabContainer.close();
        this.isOpened = false;

        this.emitOpenCloseEvent();
    }

    /**
     * Toggle isOpened and send correct event.
     */
    public toggleIsOpened() {
        this.isOpened = !this.isOpened;

        this.emitOpenCloseEvent();
    }

    /**
     * Send the favoriteStationClick event and close the FAB.
     * @param {VlilleStation} station
     */
    public favoriteClick(station: VlilleStation) {
        this.favoriteStationClick.emit(station);
        this.close();
    }
}