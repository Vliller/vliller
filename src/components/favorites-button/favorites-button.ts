import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ModalController} from 'ionic-angular';

import {Favorites} from '../../pages/favorites/favorites';

@Component({
    selector: 'favorites-button',
    templateUrl: './favorites-button.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FavoritesButton {
    constructor(
        private modalCtrl: ModalController
    ) {}

    /**
     * Open favorites modal
     */
    public openFavorites() {
        this.modalCtrl.create(Favorites).present();
    }

}
