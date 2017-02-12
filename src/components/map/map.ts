import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { DeviceOrientation } from 'ionic-native';

import { MapPosition } from './map-position';
import { MapIcon } from './map-icon';
import { VlilleStationResume, VlilleStation } from '../../services/vlille/vlille';
import { MarkersService } from '../../services/map/markers';

declare var plugin: any;

// Lille
const DEFAULT_POSITION = new MapPosition(50.633333, 3.066667);

@Component({
    selector: 'map',
    template:
    `
        <div id="map-canvas" class="map-canvas">
            <ng-content></ng-content>
        </div>
    `
})

export class Map implements OnInit {
    private mapInstance: any;
    private mapInstancePromise: Promise<any>;

    private markerIcon: any = MapIcon.NORMAL;
    private activeMarker: any;

    private userMarker: any;
    private userHeading: number = 0;

    @Input() stations: Observable<VlilleStationResume[]>;
    @Input() userPosition: Observable<MapPosition>;
    @Input() activeStation: Observable<VlilleStation>;
    @Output() activeStationChange = new EventEmitter<VlilleStationResume>();

    constructor(
        private platform: Platform,
        private markers: MarkersService
    ) {
        // init the map
        this.mapInstancePromise = this.initMap();

        // init heading watcher
        this.platform.ready().then(() => {
            DeviceOrientation.watchHeading({
                frequency: 200 // ms
            }).subscribe(compassHeading => this.userHeading = compassHeading.magneticHeading);
        });
    }

    ngOnInit() {
        // wait for map instance to be initialized
        this.mapInstancePromise.then(() => {
            // init stations marker
            this.stations.subscribe((stations: VlilleStationResume[]) => {
                this.initMarkers(stations)
                .then(() => {
                    // Updates active marker
                    this.activeStation.subscribe(activeStation => {
                        let marker = this.markers.get(activeStation.id);

                        // avoid double call to setActiveMarker during marker click
                        if (this.activeMarker && marker.id === this.activeMarker.id) {
                            return;
                        }

                        this.setActiveMarker(marker);
                    });
                });
            });

            // init user marker
            this.initUserMarker(DEFAULT_POSITION).then(() => {
                // start heading update
                window.requestAnimationFrame(() => this.updateUserHeading());

                // listen for user position
                this.userPosition.subscribe(position => {
                    this.setUserPosition(position);
                    this.setCenterMap(position);
                });
            });
        });
    }

    /**
     * Initialize map instance and bind it to #map-canvas element
     * @return {Promise<any>}
     */
    private initMap(): Promise<any> {
        let mapOptions = {
            camera: {
                latLng: DEFAULT_POSITION.toLatLng(),
                zoom: 12
            }
        };

        return new Promise<any>((resolve, reject) => {
            this.platform.ready().then(() => {
                // init map instance
                plugin.google.maps.Map
                    .getMap(document.getElementById('map-canvas'), mapOptions)
                    .one(plugin.google.maps.event.MAP_READY, (mapInstance) => {
                        this.mapInstance = mapInstance;

                        resolve(mapInstance);
                    });
            });
        });
    }

    /**
     * Create stations markers on the map
     * @param  {VlilleStationResume[]} stations
     * @return {Promise<>}
     */
    private initMarkers(stations: VlilleStationResume[]): Promise<any> {
        return new Promise((resolve, reject) => {

            // adds stations markers on map
            for (let station of stations) {
                this.mapInstance.addMarker({
                    position: {
                        lat: station.latitude,
                        lng: station.longitude
                    },
                    icon: this.markerIcon,
                    disableAutoPan: true
                }, marker => {
                    // stores created marker
                    this.markers.set(station.id, marker);

                    /**
                     * Set active marker on click
                     */
                    marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
                        this.setActiveMarker(marker);
                        this.setCenterMap(MapPosition.fromLatLng(marker.get('position')));

                        // updates active station
                        this.activeStationChange.emit(station);
                    });

                    /**
                     * addMarker() is async, so we need to wait until all the markers are created.
                     * @see https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Marker#create-multiple-markers
                     */
                    if (this.markers.size() !== stations.length) {
                        return;
                    }

                    // indicates that markers creation is done
                    resolve();
                });
            }
        });
    }

    /**
     *
     * @param {MapPosition} position
     */
    private setCenterMap(position: MapPosition, animate: boolean = false) {
        this.mapInstance.moveCamera({
            target: position.toLatLng(),
            zoom: 16,
            animate: animate
        });
    }

    /**
     *
     * @param {google.maps.Marker} marker
     */
    private setActiveMarker(marker: any) {
        // set default icon on current office marker
        if (this.activeMarker && this.activeMarker.id !== marker.id) {
            this.activeMarker.setIcon(this.markerIcon);
        }

        // set new marker
        this.activeMarker = marker;
        this.activeMarker.setIcon(MapIcon.ACTIVE);
    }

    /**
     *
     * @param  {MapPosition} position
     * @return {Promise<google.maps.Marker>}
     */
    private initUserMarker(position: MapPosition): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.mapInstance.addMarker({
                position: position.toLatLng(),
                icon: MapIcon.USER,
                disableAutoPan: true
            }, marker => {
                // avoid duplication bug
                if (this.userMarker) {
                    this.userMarker.remove();
                }

                // updates marker ref
                this.userMarker = marker;

                resolve(marker);
            });
        });
    }

    /**
     *
     * @param {MapPosition} position
     */
    private setUserPosition(position: MapPosition) {
        this.userMarker.setPosition(position.toLatLng());
    }

    /**
     * /!\ This function should be exclusively called by requestAnimationFrame() to avoid performance issues.
     */
    private updateUserHeading() {
        this.userMarker.setRotation(this.userHeading);

        // recursive call to requestAnimationFrame()
        window.requestAnimationFrame(() => this.updateUserHeading());
    }

    public setClickable(value: boolean) {
        if (!this.mapInstance) {
            return;
        }

        this.mapInstance.setClickable(value);
    }
}
