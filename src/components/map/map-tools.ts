import { MapPosition } from '../../models/map-position';
import { VlilleStation } from '../../models/vlille-station';

export class MapTools {

    /**
     * Convert degrees to radiants
     *
     * @param {number} deg
     * @return {number}
     */
    public static rad(deg: number): number {
        return deg * Math.PI / 180;
    }

    /**
     * Haversine formula
     *
     * @see http://stackoverflow.com/a/1502821/5727772
     * @param  {MapPosition} p1
     * @param  {MapPosition} p2
     * @return {number}
     */
    public static computeDistance(p1: MapPosition, p2: MapPosition): number {
        let R = 6378137; // Earth’s mean radius in meter
        let dLat = this.rad(p2.latitude - p1.latitude);
        let dLong = this.rad(p2.longitude - p1.longitude);
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(p1.latitude)) * Math.cos(this.rad(p2.latitude)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;

        return d; // returns the distance in meter
    }

    /**
     * Computes the closest station from the given position using the Haversine formula.
     * @param  {MapPosition}     position
     * @param  {VlilleStation[]} stations
     * @return {VlilleStation|undefined}
     */
    public static computeClosestStation(position: MapPosition, stations: VlilleStation[]): VlilleStation {
        if (!position || !stations.length) {
            return undefined;
        }

        // computes the distance between the position and each marker
        return stations.reduce((closest, current) => {
            current.distance = this.computeDistance(position, MapPosition.fromCoordinates(current));

            return closest.distance > current.distance ? current : closest;
        }, <VlilleStation>{
            distance: Infinity
        });
    }
}