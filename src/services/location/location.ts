import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { MapPosition } from '../../components/map/map-position';

@Injectable()
export class LocationService {
    // replay the last value to each new subscriber
    private currentPositionSubject = new ReplaySubject<MapPosition>(1);

    constructor(private platform: Platform) {}

    /**
     * Resolves a promise with the new position.
     * @return {Promise<MapPosition>}
     */
    public getCurrentPosition(): Promise<MapPosition> {
        return this.platform.ready().then(() => new Diagnostic().isLocationEnabled()
            .then(isLocationEnabled => {

                // GPS disabled
                if (!isLocationEnabled) {
                    return Promise.reject('locationDisabled');
                }

                // Get current location
                return new Geolocation().getCurrentPosition({
                    enableHighAccuracy: true
                });
            })
            .then((geoposition: Geoposition) => {
                return MapPosition.fromCoordinates(geoposition.coords);
            })
        );
    }

    /**
     * Updates the current Observable position and resolved a promise with the new position.
     * @return {Promise<MapPosition>}
     */
    public updateCurrentPosition(): Promise<MapPosition> {
        return this.getCurrentPosition()
            .then(position => {
                // Update stream
                this.currentPositionSubject.next(position);

                return position;
            });
    }

    /**
     * Checks if the location is enabled (promise resolved) or disabled (promise rejected)
     * @return {Promise<any>}
     */
    public requestLocation(): Promise<any> {
        return this.platform.ready().then(() => {
            let locationAccuracy = new LocationAccuracy();

            return locationAccuracy.canRequest().then(canRequest => {
                if (!canRequest) {
                    return Promise.resolve();
                }

                return locationAccuracy.request(locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            });
        });
    }

    /**
     * Returns an observable on the user position
     * @return {Observable<MapPosition>}
     */
    public asObservable(): Observable<MapPosition> {
        return this.currentPositionSubject.asObservable();
    }
}