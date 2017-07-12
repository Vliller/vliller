import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { MapPosition } from '../../components/map/map-position';

@Injectable()
export class LocationService {

    constructor(private platform: Platform) {}

    /**
     * Resolves a promise with the new position.
     * @return {Promise<MapPosition>}
     */
    public getCurrentPosition(): Promise<MapPosition> {
        return this.platform
            .ready()
            .then(() => new Diagnostic().isLocationEnabled())
            .then((isLocationEnabled: boolean) => {
                // GPS disabled
                if (!isLocationEnabled) {

                    /**
                     * Return a Promise<Geoposition> to match next then.
                     *
                     * @see https://github.com/Microsoft/TypeScript/issues/7588#issuecomment-198700729
                     */
                    return Promise.reject<Geoposition>(
                        new Error('Geolocation system disabled.'));
                }

                // Get current location
                return new Geolocation().getCurrentPosition({
                    enableHighAccuracy: true
                });
            })
            .then((geoposition: Geoposition) => {
                return MapPosition.fromCoordinates(geoposition.coords);
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
}