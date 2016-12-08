import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NativeStorage } from 'ionic-native';

const FAVORITES_MAX_SIZE = 4;
const STORAGE_ID = 'favorites';

interface IdConstraint {
    id: string
}

@Injectable()
export class FavoritesService<T extends IdConstraint> {
    private favorites: T[] = [];
    private favoritesSubject: Subject<T[]> = new Subject();

    constructor() {
        // loads data from storage and notify observers
        this.load().then(() => this.notify());
    }

    /**
     * Loads favorites elements from storage
     * @return {Promise<T[]>}
     */
    private load(): Promise<T[]> {
        return NativeStorage.getItem(STORAGE_ID).then(favorites => this.favorites = favorites);
    }

    /**
     * Save favorites elements to storage
     * @return {Promise<T[]>}
     */
    private save(): Promise<T[]> {
        return NativeStorage.setItem(STORAGE_ID, this.favorites);
    }

    /**
     * Notify observers about the favorites changes
     */
    private notify() {
        this.favoritesSubject.next(this.favorites);
    }

    /**
     * Adds elements, notify observers and save data to the storage
     * @param  {T} element
     * @return {boolean}
     */
    public add(element: T): boolean {
        if (!element || this.favorites.length === FAVORITES_MAX_SIZE) {
            return false;
        }

        // checks if the element already is in the array
        if (this.contains(element)) {
            return true;
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
     * @param  {T} element
     * @return {boolean}
     */
    public remove(element: T): boolean {
        if (!element || this.favorites.length === 0) {
            return false;
        }

        // removes the element if it's in the fav array
        for (let i = 0, len = this.favorites.length; i < len; i += 1) {
            if (this.favorites[i].id === element.id) {
                let returnValue = !!this.favorites.splice(i);

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
     * @param  {T} element
     * @return {boolean}
     */
    public contains(element: T): boolean {
        if (!element) {
            return false;
        }

        for (let favoriteElement of this.favorites) {
            if (favoriteElement.id === element.id) {
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @return {Observable<T>}
     */
    public asObservable(): Observable<T[]> {
        return this.favoritesSubject.asObservable();
    }
}