import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { NativeStorage } from '@ionic-native/native-storage';

import { VlilleStation } from '../../models/vlillestation'

const STORAGE_ID = 'favorites';

/**
 * Service who manage Favorites as an immutable array accessible by an observable.
 */
@Injectable()
export class FavoritesService {
    constructor(private platform: Platform) {}

    /**
     * Loads favorites elements from storage
     *
     * @return {Promise<VlilleStation[]>}
     */
    public load(): Observable<VlilleStation[]> {
        return Observable.fromPromise(
            this.platform
            .ready()
            .then(() => this._load())
        );
    }

    private _load(): Promise<VlilleStation[]> {
        return new NativeStorage().getItem(STORAGE_ID);
    }

    /**
     * Saves favorites elements to storage
     *
     * @return {Promise<VlilleStation[]>}
     */
    public save(favorites: VlilleStation[]): Observable<VlilleStation[]> {
        return Observable.fromPromise(
            this.platform
            .ready()
            .then(() => this._save(favorites))
        );
    }

    private _save(favorites: VlilleStation[]): Promise<VlilleStation[]> {
        return new NativeStorage().setItem(STORAGE_ID, favorites);
    }
}