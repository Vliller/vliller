import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { VlilleStation } from '../models/vlille-station'
import { FavoritesServiceInterface } from './favorites-service-interface';

const STORAGE_ID = 'favorites';

/**
 * Service who manage Favorites as an immutable array accessible by an observable.
 */
@Injectable()
export class FavoritesService implements FavoritesServiceInterface {
    constructor(
        private storage: Storage
    ) {}

    /**
     * Loads favorites elements from storage
     *
     * @return {Promise<VlilleStation[]>}
     */
    public load(): Observable<VlilleStation[]> {
        return Observable.fromPromise(
            this.storage
            .get(STORAGE_ID)
            .then(data => data instanceof Array ? data : [])
            .then((collection: any[]) => collection.map(VlilleStation.fromObject))
        );
    }

    /**
     * Saves favorites elements to storage
     *
     * @return {Promise<VlilleStation[]>}
     */
    public save(stations: VlilleStation[]): Observable<VlilleStation[]> {
        return Observable.fromPromise(
            this.storage
            .set(STORAGE_ID, stations)
            .then(data => data instanceof Array ? data : [])
            .then((collection: any[]) => collection.map(VlilleStation.fromObject))
        );
    }
}