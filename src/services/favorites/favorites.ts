import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController } from 'ionic-angular';

import { VlilleStation } from '../vlille/vlille'

const FAVORITES_MAX_SIZE = 4;
const STORAGE_ID = 'favorites';

interface IdConstraint {
    id: string
}

@Injectable()
export class FavoritesService {
    private favorites: VlilleStation[] = [];
    private favoritesSubject: Subject<VlilleStation[]> = new Subject();
    private maxFavAlert;

    constructor(
        platform: Platform,
        alertController: AlertController
    ) {
        // loads data from storage & notify observers
        platform.ready()
        .then(() => this.load())
        .then(() => this.notify());

        // Alert to display when the user try to add more that MAX_FAV
        this.maxFavAlert = alertController.create({
            title: 'Vous avez atteint le nombre maximum de favoris',
            subTitle: 'Vous devez supprimer un favori existant pour pouvoir en créer un nouveau.',
            buttons: ['OK']
        });
    }

    /**
     * Loads favorites elements from storage
     * @return {Promise<VlilleStation[]>}
     */
    private load(): Promise<VlilleStation[]> {
        return new NativeStorage().getItem(STORAGE_ID).then(favorites => this.favorites = favorites);
    }

    /**
     * Saves favorites elements to storage
     * @return {Promise<VlilleStation[]>}
     */
    private save(): Promise<VlilleStation[]> {
        return new NativeStorage().setItem(STORAGE_ID, this.favorites);
    }

    /**
     * Notify observers about the favorites changes
     */
    private notify() {
        this.favoritesSubject.next(this.favorites);
    }

    /**
     * Adds elements, notify observers and save data to the storage
     * @param  {VlilleStation} element
     * @return {boolean}
     */
    public add(element: VlilleStation): boolean {
        if (!element) {
            return false;
        }

        if (this.contains(element)) {
            return true;
        }

        // show popup if the favorites list is full
        if (this.favorites.length === FAVORITES_MAX_SIZE) {
            this.maxFavAlert.present();

            return false;
        }

        // add element the the array
        let returnValue = !!this.favorites.push(element);

        // notify observers
        this.notify();

        // save to storage
        this.save();

        return returnValue;
    }

    /**
     * Removes elements, notify observers and save data to the storage
     * @param  {VlilleStation} element
     * @return {boolean}
     */
    public remove(element: VlilleStation): boolean {
        if (!element || this.favorites.length === 0) {
            return false;
        }

        // removes the element if it's in the fav array
        for (let i = 0, len = this.favorites.length; i < len; i += 1) {
            if (this.favorites[i].id === element.id) {
                let returnValue = !!this.favorites.splice(i, 1);

                // notify observers
                this.notify();

                // save to storage
                this.save();

                return returnValue;
            }
        }

        return true;
    }

    /**
     *
     * @param  {VlilleStation} element
     * @return {boolean}
     */
    public contains(element: VlilleStation): boolean {
        if (!element) {
            return false;
        }

        // compares element id
        for (let favoriteElement of this.favorites) {
            if (favoriteElement.id === element.id) {
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @return {Observable<VlilleStation>}
     */
    public asObservable(): Observable<VlilleStation[]> {
        return this.favoritesSubject.asObservable();
    }
}