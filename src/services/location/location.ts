import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition, Diagnostic, LocationAccuracy } from 'ionic-native';

import { MapPosition } from '../../components/map/map';

@Injectable()
export class LocationService {
    // replay the last value to each new subscriber
    private currentPositionSubject = new ReplaySubject<MapPosition>(1);

    constructor(private platform: Platform) {}

    /**
     * Updates the current Observable position and resolved a promise with the new position.
     * @return {Promise<MapPosition>}
     */
    public updateCurrentPosition(): Promise<MapPosition> {
        return this.platform.ready().then(() => Diagnostic.isLocationEnabled()
            .then(isLocationEnabled => {

                // GPS disabled
                if (!isLocationEnabled) {
                    return Promise.reject('locationDisabled');
                }

                // Get current location
                return Geolocation.getCurrentPosition()
            })
            .then((geoposition: Geoposition) => {
                let position = MapPosition.fromCoordinates(geoposition.coords);

                // Update stream
                this.currentPositionSubject.next(position);

                return position;
            })
        );
    }

    /**
     * Checks if the location is enabled (promise resolved) or disabled (promise rejected)
     * @return {Promise<any>}
     */
    public requestLocation(): Promise<any> {
        return this.platform.ready().then(() => LocationAccuracy.canRequest().then(canRequest => {
            if (!canRequest) {
                return Promise.resolve();
            }

            return LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        }));
    }

    /**
     * Returns an observable on the user position
     * @return {Observable<MapPosition>}
     */
    public asObservable(): Observable<MapPosition> {
        return this.currentPositionSubject.asObservable();
    }
}