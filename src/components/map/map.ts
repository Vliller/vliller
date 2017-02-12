import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { DeviceOrientation } from 'ionic-native';

import { VlilleStationResume, VlilleStation } from '../../services/vlille/vlille';

declare var plugin: any;

export const MapIcon = {
    NORMAL: {
        url: 'www/assets/img/vliller-marker-white.png',
        size: {
            width: 38,
            height: 45
        }
    },
    SMALL: {
        url: 'www/assets/img/vliller-marker-red-small.png',
        size: {
            width: 12,
            height: 12
        }
    },
    ACTIVE: {
        url: 'www/assets/img/vliller-marker-red.png',
        size: {
            width: 60,
            height: 69
        }
    },
    UNAVAIBLE: {
        url: 'www/assets/img/vliller-marker-grey.png',
        size: {
            width: 60,
            height: 69
        }
    },
    USER: {
        url: 'www/assets/img/vliller-marker-user.png',
        size: {
            width: 22,
            height: 34
        },
        anchor: [11, 23]
    }
};

/**
 * Helper to manage Google LatLng class easily.
 */
export class MapPosition {
    constructor(
        public latitude: number,
        public longitude: number
    ) {}

    static fromLatLng(latlng: any): MapPosition {
        return new MapPosition(
            latlng.lat,
            latlng.lng
        );
    }

    static fromCoordinates(coordinates: any): MapPosition {
        return new MapPosition(
            coordinates.latitude,
            coordinates.longitude
        );
    }

    public toLatLng(): any {
        return {
            lat: this.latitude,
            lng: this.longitude
        };
    }
}

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

    private markers: any = [];
    private markerIcon: any = MapIcon.NORMAL;
    private activeMarker: any;

    private userMarker: any;
    private userMarkerPromise: Promise<any>;
    private userHeading: number = 0;

    @Input() stations: Observable<VlilleStationResume[]>;
    @Input() userPosition: Observable<MapPosition>;
    @Input() activeStation: Observable<VlilleStation>;
    @Output() activeStationResumeChange = new EventEmitter<VlilleStationResume>();

    constructor(
        private platform: Platform
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
            // init user marker
            this.userMarkerPromise = this.initUserMarker(DEFAULT_POSITION);
            this.userMarkerPromise.then(() => {
                // start heading update
                window.requestAnimationFrame(() => this.updateUserHeading());
            });

            // init stations marker
            this.stations.subscribe((stations: VlilleStationResume[]) => {
                this.initMarkers(stations)
                .then(() => {
                    // Updates active marker
                    this.activeStation.subscribe(activeStation => this.setActiveMarker(activeStation.marker, false))

                    // wait for user marker to be created
                    return this.userMarkerPromise;
                })
                .then(() => {
                    // listen for user position
                    this.userPosition.subscribe(position => {
                        this.setUserPosition(position);
                        this.setCenterMap(position);
                    });
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
     * @return {Promise<google.maps.Marker[]>}
     */
    private initMarkers(stations: VlilleStationResume[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            // console.debug("markers creation start")
            // let start = Date.now();

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
                    // store list of markers
                    this.markers.push(marker);

                    // store marker in station object
                    (<any>station).marker = marker;

                    /**
                     * Set active marker on click
                     */
                    marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
                        this.setActiveMarker(marker);

                        // updates active station
                        this.activeStationResumeChange.emit(station);
                    });

                    /**
                     * addMarker is async, so we need to wait until all the marker are adds to the map.
                     * @see https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Marker#create-multiple-markers
                     */
                    if (this.markers.length !== stations.length) {
                        return;
                    }

                    // let duration = ((Date.now() - start) / 1000).toFixed(2);
                    // console.debug("markers creation done: " + duration)
                    // alert("Duration: " + duration + "s (for " + this.markers.length + " markers)");

                    // indicates that markers creation is done
                    resolve(this.markers);
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
     * @param {boolean} centerMap
     */
    private setActiveMarker(marker: any, centerMap: boolean = true) {
        // set default icon on current office marker
        if (this.activeMarker && this.activeMarker.id !== marker.id) {
            this.activeMarker.setIcon(this.markerIcon);
        }

        this.activeMarker = marker;

        // center map
        if (centerMap) {
            this.setCenterMap(MapPosition.fromLatLng(marker.get('position')));
        }

        /**
         * Handle Offline case
         */
        // if (this.isOffline) {
        //     // update marker
        //     activeMarker.setIcon(icons.iconActive);

        //     // to avoid touch bug after card resizing
        //     // $timeout(function () {
        //     //     map.refreshLayout();
        //     // }, 100);
        // } else {
        //     loadsActiveStationDetails(station.id);
        // }

        // update marker
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
