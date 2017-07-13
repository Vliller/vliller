/**
 * Helpers to manage Google LatLng class easily.
 */
export interface LatLng {
    lat: number,
    lng: number
}

export class MapPosition {
    constructor(
        public latitude: number,
        public longitude: number,
        public accuracy: number = 0
    ) {}

    static fromLatLng(latlng: LatLng): MapPosition {
        return new MapPosition(
            latlng.lat,
            latlng.lng
        );
    }

    static fromCoordinates(coordinates: any): MapPosition {
        return new MapPosition(
            coordinates.latitude,
            coordinates.longitude,
            coordinates.accuracy
        );
    }

    public toLatLng(): LatLng {
        return {
            lat: this.latitude,
            lng: this.longitude
        };
    }
}