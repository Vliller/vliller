import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition, Diagnostic, LocationAccuracy } from 'ionic-native';

export interface Position extends Geoposition {}

@Injectable()
export class LocationService {
    private currentPositionSubject: Subject<Geoposition> = new Subject();

    constructor(private platform: Platform) {}

    public updateCurrentPosition(): Promise<any> {
        return this.platform.ready().then(() => Diagnostic.isLocationEnabled()
            .then(isLocationEnabled => {

                // GPS disabled
                if (!isLocationEnabled) {
                    return Promise.reject('locationDisabled');
                }

                // Get current location
                return Geolocation.getCurrentPosition()
            })
            .then((position: Geoposition) => this.currentPositionSubject.next(position))
        );
    }

    public requestLocation(): Promise<any> {
        return this.platform.ready().then(() => LocationAccuracy.canRequest().then(canRequest => {
            if (!canRequest) {
                return Promise.resolve();
            }

            return LocationAccuracy.request(LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
        }));
    }

    public asObservable(): Observable<Geoposition> {
        return this.currentPositionSubject.asObservable();
    }
}