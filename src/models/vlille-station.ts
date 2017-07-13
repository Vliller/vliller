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
        public distance?: number,
        public isFavorite: boolean = false
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