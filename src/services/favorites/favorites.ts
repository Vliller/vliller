import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NativeStorage } from '@ionic-native/native-storage';

import { VlilleStation } from '../../models/vlillestation'

const FAVORITES_MAX_SIZE = 4;
const STORAGE_ID = 'favorites';

/**
 * Service who manage Favorites as an immutable array accessible by an observable.
 */
@Injectable()
export class FavoritesService {
    private favorites: VlilleStation[] = [];
    private favoritesSubject: Subject<VlilleStation[]> = new Subject();

    constructor(private platform: Platform) {
        // loads data from storage & notify observers
        platform.ready()
        .then(() => this.load())
        .then(() => this.notify());
    }

    /**
     * Loads favorites elements from storage
     *
     * @return {Promise<VlilleStation[]>}
     */
    private load(): Promise<VlilleStation[]> {
        return new NativeStorage().getItem(STORAGE_ID).then(favorites => this.favorites = favorites);
    }

    /**
     * Saves favorites elements to storage
     *
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
     * Adds elements (create a new array), notify observers and save data to the storage
     *
     * @param  {VlilleStation} element
     * @return {VlilleStation[]}
     */
    public add(element: VlilleStation): boolean {
        if (!element || this.favorites.length === FAVORITES_MAX_SIZE) {
            return false;
        }

        if (this.contains(element)) {
            return true;
        }

        // create a new array with the new element at the end
        // This allow OnPush changeDetection
        this.favorites = this.favorites.concat(element);

        // notify observers
        this.notify();

        // save to storage
        this.save();

        return true;
    }

    /**
     * Removes elements (create a new array), notify observers and save data to the storage
     *
     * @param  {VlilleStation} element
     * @return {boolean}
     */
    public remove(element: VlilleStation): boolean {
        if (!element || this.favorites.length === 0) {
            return false;
        }

        // create a new array without the given element
        let favoritesAsChanged = false;
        this.favorites = this.favorites.filter(favorite => {
            // filter element to remove
            if (favorite.id === element.id) {
                favoritesAsChanged = true;

                return false;
            }

            return true;
        });

        if (favoritesAsChanged) {
            // notify observers
            this.notify();

            // save to storage
            this.save();
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