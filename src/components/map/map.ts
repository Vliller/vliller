import { Component, Input } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { VlilleStationResume } from '../vlille/vlille';

declare var plugin: any;

// TODO: put this in constructor arguments
const DEFAULT_POSITION = {
    latitude: 50.633333,
    longitude: 3.066667
};

@Component({
    selector: 'map',
    template: '<div id="map-canvas" class="map-canvas"></div>'
})

export class Map {
    private _mapInstance: any;

    @Input() stations: Observable<VlilleStationResume[]>;

    constructor(platform: Platform) {
        platform.ready().then(() => {
            this.prepareMapInstance().then(this.initMap.bind(this));
        });
    }

    /**
     *
     * @return {Promise<any>} Promise returning the map instance on resolve
     */
    private prepareMapInstance(): Promise<any> {
        let mapElement = document.getElementById('map-canvas');

        return new Promise<any>(
            resolve => plugin.google.maps.Map.getMap(mapElement).one(plugin.google.maps.event.MAP_READY, resolve)
        );
    }

    private initMap(mapInstance: any) {
        this._mapInstance = mapInstance;

        this.stations.subscribe(stations => {
            // TODO: load stations
        });

        this.setCenterMap(DEFAULT_POSITION);
    }

    public setCenterMap(position: any) {
        this._mapInstance.animateCamera({
            target: {
                lat: position.latitude,
                lng: position.longitude
            },
            zoom: 16,
            duration: 1000
        });
    }
}
