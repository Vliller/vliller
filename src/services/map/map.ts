import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { MapPosition } from '../../components/map/map';

const MAPBOX_API_BASE = 'https://api.mapbox.com/directions/v5/mapbox/walking/';
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYmxja3NocmsiLCJhIjoiY2l5YWc5anUyMDA0cDMzcWtxcnN0ZWxxcCJ9.xKDTqbkNCQTRvizwIDGeCQ';

function rad(x: number): number {
    return x * Math.PI / 180;
}

@Injectable()
export class MapService {

    constructor(private http: Http) {}

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
     *
     * @param  {MapPosition}               position
     * @param  {Array<google.maps.Marker>} markers
     * @return {google.maps.Marker}
     */
    public computeClosestMarker(position: MapPosition, markers: Array<any>): any {
        return markers.reduce((closest, current) => {
            let currentPosition = current.get('position');
            let distance = this.getDistance(position, MapPosition.fromLatLng(currentPosition));

            current.set('distance', distance);

            return closest.get('distance') > current.get('distance') ? current : closest;
        }, {
            get: () => Infinity
        });
    }

    /**
     * Compute precise walking distance between to point using MapBox API.
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
}