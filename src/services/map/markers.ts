import { Injectable } from '@angular/core';
import { VlilleStationResume } from '../vlille/vlille';

@Injectable()
export class MarkersService {
    /**
     * key: station id
     * value: google.maps.Marker
     */
    private markers = new Map<string, any>();

    public set(stationId: string, marker: any) {
        this.markers.set(stationId, marker);
    }

    public remove(stationId: string) {
        this.markers.delete(stationId);
    }

    public get(stationId: string): any {
        return this.markers.get(stationId);
    }

    public getAll(): any {
        return this.markers.values();
    }

    public size(): number {
        return this.markers.size;
    }
}