import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

/**
 *
 */
export class VlilleStationResume {
    constructor(
        public id: string,
        public name: string,
        public latitude: number,
        public longitude: number
    ) {}
}

/**
 *
 */
export class VlilleStationDetails {
    constructor(
        public address: string,
        public bikes: number,
        public docks: number,
        public payment: string,
        public status: string,
        public lastupd: string
    ) {}
}

const API_BASE = 'http://dev.alexandrebonhomme.fr/vlille/web';
const API_ENDPOINT = '/stations';

@Injectable()
export class VlilleService {

    constructor(private http: Http) {}

    get(id: number): Observable<VlilleStationDetails> {
        return this.http
            .get(API_BASE + API_ENDPOINT + '/' + id)
            .map((response: Response) => <VlilleStationDetails>response.json())
            .catch(this.handleError);
    }

    getAll(): Observable<VlilleStationResume[]> {
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