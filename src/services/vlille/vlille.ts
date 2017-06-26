/**
 * TODO: Improves error handling (eg. no result case)
 */

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';
import moment from 'moment';
import 'moment/locale/fr';

const API_BASE = 'https://opendata.lillemetropole.fr/api/records/1.0/search';
const API_ENDPOINT = '/?dataset=vlille-realtime&rows=500';


/**
 *
 */
export class VlilleStation {
    constructor(
        public id: string,
        public name: string,
        public latitude: number,
        public longitude: number,
        public address: string,
        public bikes: number,
        public docks: number,
        public payment: string,
        public status: string,
        public lastupd: string,
        public distance?: number
    ) {}

    /**
     * Returns a string format in meters or kilometers.
     *
     * @return {string}
     */
    get formatedDistance() {
        let distanceInMeter = this.distance,
            distanceString = '';

        // to avoid blinking
        if (!distanceInMeter) {
            return '';
        }

        // meters
        if (distanceInMeter < 1000) {
            distanceString += Math.round(distanceInMeter) + 'm';
        }

        // kilometers
        else {
            distanceString += (Math.round(distanceInMeter / 100) / 10) + 'km';
        }

        return distanceString;
    }
}

@Injectable()
export class VlilleService {

    constructor(private http: Http) {}

    public getStation(id: string): Observable<VlilleStation> {
        return this.http
            .get(API_BASE + API_ENDPOINT + '&q=libelle:' + id)
            .map(response => response.json().records.map(this.rawDataToVlilleStation)[0])
            .catch(this.handleError);
    }

    public getAllStations(): Observable<VlilleStation[]> {
        return this.http
            .get(API_BASE + API_ENDPOINT)
            .map(response => response.json().records.map(this.rawDataToVlilleStation))
            .catch(this.handleError);
    }

    /**
     *
     * @param  {any} data
     * @return {VlilleStation}
     */
    private rawDataToVlilleStation(data): VlilleStation {
        let station = new VlilleStation(
            data.fields.libelle,
            data.fields.nom.replace(/^([0-9]+ )/, '').replace(/( \(CB\))$/, ''),
            data.fields.geo[0],
            data.fields.geo[1],
            data.fields.adresse,
            data.fields.nbVelosDispo,
            data.fields.nbPlacesDispo,
            data.fields.type,
            undefined,
            undefined
        );

        /*
            Status
         */
        if (data.fields.etat === 'EN SERVICE') {
            station.status = '0';
        } else {
            station.status = '1';
        }

        if (station.bikes === 0 && station.docks === 0) {
            station.status = '418';
        }

        /*
            Last up
         */
        var diffInSeconds = Math.round(moment().diff(moment.utc(data.record_timestamp))/ 1000);

        station.lastupd = diffInSeconds + ' seconde' + (diffInSeconds > 1 ? 's' : '');

        return station;
    }

    /**
     * From Angular doc.
     * TODO: improve
     *
     * @param {Response | any} error [description]
     */
    private handleError (error: Response | any) {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        console.error(errMsg);

        // sends error to Sentry
        Raven.captureException(Error(errMsg));

        return Observable.throw(errMsg);
    }

}