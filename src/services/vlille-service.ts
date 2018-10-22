import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../models/vlille-station';
import { VlilleServiceInterface } from './vlille-service-interface';

@Injectable()
export class VlilleService implements VlilleServiceInterface {

    /**
     * @todo Implements Web version.
     *
     * @param {number} id
     * @return {Observable<VlilleStation>}
     */
    public getStation(id: number): Observable<VlilleStation> {
        return Observable.empty();
    }

    /**
     * @todo Implements Web version.
     *
     * @return {Observable<VlilleStation[]>}
     */
    public getAllStations(): Observable<VlilleStation[]> {
        return Observable.empty();
    }
}