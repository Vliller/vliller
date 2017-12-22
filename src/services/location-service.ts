import { Injectable } from '@angular/core';

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

    /**
     * @todo Implements full web version
     *
     * @return {Promise<MapPosition>}
     */
    public getCurrentPosition(): Promise<MapPosition> {
        return Promise.reject("Not implemented");
    }

    /**
     * @todo Implements full web version
     *
     * @return {Promise<any>}
     */
    public requestLocation(): Promise<any> {
        return Promise.reject("Not implemented");
    }
}