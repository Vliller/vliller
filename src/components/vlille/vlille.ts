import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

/**
 *
 */
export interface VlilleStationResume {
    id: string,
    name: string,
    latitude: number,
    longitude: number
}

/**
 *
 */
export interface VlilleStationDetails {
    address: string,
    bikes: number,
    docks: number,
    payment: string,
    status: string,
    lastupd: string
}

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
        public lastupd: string
    ) {}

    /**
     *
     * @param  {VlilleStationResume}  stationResume
     * @param  {VlilleStationDetails} stationDetails
     * @return {VlilleStation}
     */
    static createFromResumeAndDetails(stationResume: VlilleStationResume, stationDetails: VlilleStationDetails): VlilleStation {
        return new VlilleStation(
            stationResume.id,
            stationResume.name,
            stationResume.latitude,
            stationResume.longitude,
            stationDetails.address,
            stationDetails.bikes,
            stationDetails.docks,
            stationDetails.payment,
            stationDetails.status,
            stationDetails.lastupd
        );
    }
}

const API_BASE = 'http://dev.alexandrebonhomme.fr/vlille/web';
const API_ENDPOINT = '/stations';

@Injectable()
export class VlilleService {

    constructor(private http: Http) {}

    public getStation(id: string): Observable<VlilleStationDetails> {
        return this.http
            .get(API_BASE + API_ENDPOINT + '/' + id)
            .map((response: Response) => <VlilleStationDetails>response.json())
            .catch(this.handleError);
    }

    public getAllStations(): Observable<VlilleStationResume[]> {
        return this.http
            .get(API_BASE + API_ENDPOINT)
            .map((response: Response) => <VlilleStationResume[]>response.json())
            .catch(this.handleError);
    }

    /**
     * From Angular doc.
     * TODO: improve
     *
     * @param {Response | any} error [description]
     */
    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}