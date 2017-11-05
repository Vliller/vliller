/**
 * Models related to VlilleStation
 */

export enum VlilleStationStatus {
  NORMAL = 0,
  UNAVAILABLE = 1
}

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
        return (this.bikes * 100) / (this.bikes + this.docks);
    }
}