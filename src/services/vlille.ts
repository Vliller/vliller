/**
 * TODO: Improves error handling (eg. no result case)
 */

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HTTP, HTTPResponse } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import * as Raven from 'raven-js';

import { AppSettings } from '../app/app.settings';
import { VlilleStation } from '../models/vlille-station';

const API_BASE = `${AppSettings.vlille.apiBase}&apikey=${AppSettings.vlille.apiKey}`;

@Injectable()
export class VlilleService {

    constructor(
        private http: HTTP,
        private platform: Platform
    ) {}

    public getStation(id: string): Observable<VlilleStation> {
        return Observable
            .fromPromise(
                this.platform.ready().then(() => this.http.get(`${API_BASE}&q=libelle:${id}`, {}, {}))
            )
            .map(response => JSON.parse(response.data))
            .map(data => data.records.map(VlilleStation.rawDataToVlilleStation)[0])
            .catch(this.handleError);
    }

    public getAllStations(): Observable<VlilleStation[]> {
        return Observable
            .fromPromise(
                this.platform.ready().then(() => this.http.get(API_BASE, {}, {}))
            )
            .map(response => JSON.parse(response.data))
            .map(data => data.records.map(VlilleStation.rawDataToVlilleStation))
            .catch(this.handleError);
    }

    /**
     * Minimal error handler
     *
     * @param {HTTPResponse | any} errorResponse
     */
    private handleError (errorResponse: HTTPResponse | any) {
        let errorMessage: string;

        if (errorResponse.error) {
            errorMessage = `${errorResponse.status} - ${errorResponse.error}`;
        } else {
            errorMessage = errorResponse.message ? errorResponse.message : errorResponse.toString();
        }

        // sends error to Sentry
        Raven.captureException(new Error(errorMessage));

        return Observable.throw(errorMessage);
    }

}