import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from 'ionic-native';

export interface Position extends Geoposition {}

@Injectable()
export class LocationService {
    private currentPositionSubject: Subject<Geoposition> = new Subject();

    constructor(private platform: Platform) {}

    public updateCurrentPosition() {
        this.platform.ready().then(() =>
            Geolocation.getCurrentPosition().then(
                position => this.currentPositionSubject.next(position)
            ).catch(error => console.log(error))
        );
    }

    public asObservable(): Observable<Geoposition> {
        return this.currentPositionSubject.asObservable();
    }
}