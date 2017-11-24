import { ILatLng } from '@ionic-native/google-maps';

export interface CoordinatesInterface {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

export class MapPosition implements CoordinatesInterface {
    constructor(
        public latitude: number,
        public longitude: number,
        public accuracy: number = 0
    ) {}

    static fromLatLng(latlng: ILatLng): MapPosition {
        return new MapPosition(
            latlng.lat,
            latlng.lng
        );
    }

    static fromCoordinates(coordinates: CoordinatesInterface): MapPosition {
        return new MapPosition(
            coordinates.latitude,
            coordinates.longitude,
            (<any>coordinates).accuracy
        );
    }

    public toLatLng(): ILatLng {
        return {
            lat: this.latitude,
            lng: this.longitude
        };
    }
}