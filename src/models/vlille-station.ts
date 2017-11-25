import moment from 'moment';
import 'moment/locale/fr';
import { CoordinatesInterface } from './coordinates-interface';

/**
 * Models related to VlilleStation
 */

export enum VlilleStationStatus {
  NORMAL = 0,
  UNAVAILABLE = 1
}

export class VlilleStation implements CoordinatesInterface {
    constructor(
        public id: string,
        public name: string,
        public latitude: number,
        public longitude: number,
        public address: string,
        public bikes: number,
        public docks: number,
        public payment: string,
        public status: VlilleStationStatus,
        public lastupd: string,
        public distance?: number,
        public isFavorite: boolean = false
    ) {}

    /**
     * Returns a string format in meters or kilometers.
     *
     * @return {string}
     */
    get formatedDistance(): string {
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

    /**
     * Compute the station fulfillment in percent
     *
     * @return {number}
     */
    get fulfillmentInPercent(): number {
        let total = this.bikes + this.docks;

        return total !== 0 ? (this.bikes / total) * 100 : 0;
    }

    /**
     * Basic equal method based on station id.
     *
     * @param {VlilleStation} station
     * @return {boolean}
     */
    public isEqual(station: VlilleStation): boolean {
        return this.id === station.id;
    }

    /**
     * Constructs a VlilleStation object from a raw object.
     *
     * @param {any} object
     * @return {VlilleStation}
     */
    static fromObject(object: any): VlilleStation {
        return new VlilleStation(
            object.id,
            object.name,
            object.latitude,
            object.longitude,
            object.address,
            object.bikes,
            object.docks,
            object.payment,
            object.status,
            object.lastupd,
            object.distance,
            object.isFavorite
        );
    }

    /**
     *
     * @param  {any} data
     * @return {VlilleStation}
     */
    static rawDataToVlilleStation(data): VlilleStation {
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
            station.status = VlilleStationStatus.NORMAL;
        } else {
            station.status = VlilleStationStatus.UNAVAILABLE;
        }

        if (station.bikes === 0 && station.docks === 0) {
            // teapot
            station.status = VlilleStationStatus.UNAVAILABLE;
        }

        /*
            Last up
         */
        var diffInSeconds = Math.round(moment().diff(moment.utc(data.record_timestamp))/ 1000);

        station.lastupd = diffInSeconds + ' seconde' + (diffInSeconds > 1 ? 's' : '');

        return station;
    }

    /**
     * Simple contains method bases on isEqual().
     *
     * @param  {VlilleStation[]} collection
     * @param  {VlilleStation}   element
     * @return {boolean}
     */
    static contains(collection: VlilleStation[], element: VlilleStation): boolean {
        for (let currentElement of collection) {
            if (currentElement.isEqual(element)) {
                return true;
            }
        }

        return false;
    }
}