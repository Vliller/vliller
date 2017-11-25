import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { MapPosition } from '../models/map-position';
import { LocationServiceInterface } from './location-service-interface';

export class LocationDisabledError extends Error {
  type: string = "LocationDisabledError";

  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, LocationDisabledError.prototype);
  }
}

@Injectable()
export class LocationService implements LocationServiceInterface {

    constructor(
        private platform: Platform,
        private geolocationPlugin: Geolocation,
        private locationAccuracyPlugin: LocationAccuracy,
        private diagnosticPlugin: Diagnostic
    ) {}

    /**
     * Resolves a promise with the new position.
     * @return {Promise<MapPosition>}
     */
    public getCurrentPosition(): Promise<MapPosition> {
        return this.platform
            .ready()
            .then(() => this.diagnosticPlugin.isLocationEnabled())
            .then((isLocationEnabled: boolean) => {
                // GPS disabled
                if (!isLocationEnabled) {

                    /**
                     * Return a Promise<Geoposition> to match next then.
                     *
                     * @see https://github.com/Microsoft/TypeScript/issues/7588#issuecomment-198700729
                     */
                    return Promise.reject<Geoposition>(
                        new LocationDisabledError('Geolocation system disabled.'));
                }

                // Get current location
                return this.geolocationPlugin.getCurrentPosition({
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
            return this.locationAccuracyPlugin.canRequest().then(canRequest => {
                if (!canRequest) {
                    return Promise.resolve();
                }

                return this.locationAccuracyPlugin.request(this.locationAccuracyPlugin.REQUEST_PRIORITY_HIGH_ACCURACY);
            });
        });
    }
}