import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MapPosition } from '../../components/map/map-position';
import { VlilleStation } from '../../models/vlillestation';

const MAPBOX_API_BASE = 'https://api.mapbox.com/directions/v5/mapbox/walking/';
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYmxja3NocmsiLCJhIjoiY2l5YWc5anUyMDA0cDMzcWtxcnN0ZWxxcCJ9.xKDTqbkNCQTRvizwIDGeCQ';

function rad(x: number): number {
    return x * Math.PI / 180;
}

@Injectable()
export class MapService {

    public isMapClickableSubject: BehaviorSubject<boolean>;

    constructor(private http: Http) {
        this.isMapClickableSubject = new BehaviorSubject(true);
    }

    /**
     * Haversine formula
     * @see http://stackoverflow.com/a/1502821/5727772
     * @param  {MapPosition} p1
     * @param  {MapPosition} p2
     * @return {number}
     */
    public getDistance(p1: MapPosition, p2: MapPosition): number {
        let R = 6378137; // Earth’s mean radius in meter
        let dLat = rad(p2.latitude - p1.latitude);
        let dLong = rad(p2.longitude - p1.longitude);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d; // returns the distance in meter
    }

    /**
     * @deprecated TODO: removes
     *
     * Computes the closest marker from the given position using the Haversine formula.
     * @param  {MapPosition}               position
     * @param  {Array<google.maps.Marker>} markers
     * @return {Observable<google.maps.Marker>}
     */
    public computeClosestMarker(position: MapPosition, markers: Array<any>): Observable<any> {
        return new Observable<any>(observer => {
            // computes the distance between the position and each marker
            let closestMarker = markers.reduce((closest, current) => {
                let currentPosition = current.get('position');
                let distance = this.getDistance(position, MapPosition.fromLatLng(currentPosition));

                current.set('distance', distance);

                return closest.get('distance') > current.get('distance') ? current : closest;
            }, {
                get: () => Infinity
            });

            // sends the closest marker through the stream
            observer.next(closestMarker);
        });
    }

    /**
     * Computes the closest station from the given position using the Haversine formula.
     * @param  {MapPosition}           position
     * @param  {any[]}                 stations
     * @return {VlilleStation}
     */
    public computeClosestStation(position: MapPosition, stations: any[]): VlilleStation {
        // computes the distance between the position and each marker
        return stations.reduce((closest, current) => {
            current.distance = this.getDistance(position, MapPosition.fromCoordinates(current));

            return closest.distance > current.distance ? current : closest;
        }, {
            distance: Infinity
        });
    }

    /**
     * Computes precise walking distance between to points using MapBox API.
     * @param  {MapPosition}        start
     * @param  {MapPosition}        end
     * @return {Observable<number>}
     */
    public computePreciseDistance(start: MapPosition, end: MapPosition): Observable<number> {
        return this.http
        .get(MAPBOX_API_BASE + start.longitude + ',' + start.latitude + ';' + end.longitude + ',' + end.latitude + '?overview=false&access_token=' + MAPBOX_ACCESS_TOKEN)
        .map(response => {
            let direction = response.json();

            if (direction.routes && direction.routes[0]) {
                return direction.routes[0].distance;
            } else {
                return -1;
            }
        });
    }

    /**
     * Manage map clickable status through an Observable.
     *
     * @param {boolean} isClickable
     */
    public setMapClickable(isClickable: boolean) {
        this.isMapClickableSubject.next(isClickable);
    }

    /**
     * Return map clickable Observable
     *
     * @return {Observable<boolean>}
     */
    public isMapClickableAsObservable(): Observable<boolean> {
        return this.isMapClickableSubject.asObservable();
    }
}