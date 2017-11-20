/**
 * TODO: Improves error handling (eg. no result case)
 */

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';

import { AppSettings } from '../app/app.settings';
import { VlilleStation } from '../models/vlille-station';

const API_BASE = `${AppSettings.vlille.apiBase}&apikey=${AppSettings.vlille.apiKey}`;

@Injectable()
export class VlilleService {

    constructor(private http: Http) {}

    public getStation(id: string): Observable<VlilleStation> {
        return this.http
            .get(`${API_BASE}&q=libelle:${id}`)
            .map(response => response.json().records.map(VlilleStation.rawDataToVlilleStation)[0])
            .catch(this.handleError);
    }

    public getAllStations(): Observable<VlilleStation[]> {
        return this.http
            .get(API_BASE)
            .map(response => response.json().records.map(VlilleStation.rawDataToVlilleStation))
            .catch(this.handleError);
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

        // sends error to Sentry
        Raven.captureException(new Error(errMsg));

        return Observable.throw(errMsg);
    }

}