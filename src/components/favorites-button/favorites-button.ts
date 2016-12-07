import { Component } from '@angular/core';

import { VlilleStation } from '../../services/vlille/vlille';

const FAVORITES_MAX_SIZE = 4;

@Component({
    selector: 'favorites-button',
    templateUrl: './favorites-button.html'
})

export class FavoritesButton {
    private favoriteStations: VlilleStation[];

    constructor() {
        // TODO: init from localstorage
        this.favoriteStations = [];
    }

    /**
     *
     * @param  {VlilleStation} station
     * @return {boolean}
     */
    public add(station: VlilleStation): boolean {
        if (this.favoriteStations.length === FAVORITES_MAX_SIZE) {
            return false;
        }

        // checks if the station already is in the array
        for (let favoriteStation of this.favoriteStations) {
            if (favoriteStation.id === station.id) {
                return true;
            }
        }

        // add station the the array
        return !!this.favoriteStations.push(station);
    }

    /**
     *
     * @param  {VlilleStation} station
     * @return {boolean}
     */
    public remove(station: VlilleStation): boolean {
        if (this.favoriteStations.length === 0) {
            return false;
        }

        // removes the station if it's in the fav array
        for (let i = 0, len = this.favoriteStations.length; i < len; i += 1) {
            if (this.favoriteStations[i].id === station.id) {
                return !!this.favoriteStations.splice(i);
            }
        }

        // add station the the array
        return true;
    }
}