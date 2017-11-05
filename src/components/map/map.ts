import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { DeviceOrientation } from '@ionic-native/device-orientation';

import { MapIcon, DynamicMapIcon } from './map-icon';
import { MapPosition } from '../../models/map-position';
import { VlilleStation, VlilleStationStatus } from '../../models/vlille-station';
import { VlilleStationMarker } from '../../models/vlille-station-marker';

import { AppSettings } from '../../app/app.settings';
import { Store } from '@ngrx/store';
import { AppState, selectMapIsClickable } from '../../app/app.reducers';
import { ToastActions } from '../../actions/toast';
import { StationsActions } from '../../actions/stations';

declare var plugin: any;

const ZOOM_DEFAULT = 12;
const ZOOM_THRESHOLD = 14;

@Component({
    selector: 'map',
    template:`
        <div id="map-canvas" class="map-canvas">
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        :host {
            display: block;
        }

        .map-canvas {
            height: 100%;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapComponent implements OnInit {
    private mapInstance: any;
    private mapInstancePromise: Promise<any>;
    private mapZoom: number = ZOOM_DEFAULT;
    private mapIsUnzoom: boolean = false;

    private markers: Map<string, VlilleStationMarker|any> = new Map();
    private activeMarker: VlilleStationMarker;

    private userMarker: any;
    private userMarkerAccuracy: any;
    private userHeading: Observable<number>;

    @Input() stations: Observable<VlilleStation[]>;
    @Input() userPosition: Observable<MapPosition>;
    @Input() activeStation: Observable<VlilleStation>;

    constructor(
        private platform: Platform,
        private deviceOrientationPlugin: DeviceOrientation,
        private store: Store<AppState>
    ) {
        // show loader
        store.dispatch(new ToastActions.Show({
            message: "Ça pédale pour charger les stations&nbsp;!",
            options: {
                showSpinner: true
            }
        }));

        // init the map
        this.mapInstancePromise = this.initMap();

        // init heading observable
        this.platform.ready().then(() => {
            this.userHeading = this.deviceOrientationPlugin
            .watchHeading({
                frequency: 500 // ms
            })
            .map(compassHeading => compassHeading.magneticHeading)
            .filter(heading => !!heading);
        });
    }

    ngOnInit() {
        // wait for map instance to be initialized
        this.mapInstancePromise.then(() => {
            // register isClickable service
            this.store.select(state => selectMapIsClickable(state)).subscribe(isClickable => {
                this.setClickable(isClickable);
            });

            // init user marker
            this.initUserMarker(MapPosition.fromLatLng(AppSettings.defaultPosition)).then(() => {
                // listen for user position
                this.userPosition.subscribe(position => {
                    this.setUserPosition(position);
                    this.setCenter(position);
                });

                // listen for user heading
                this.userHeading.subscribe(heading => this.userMarker.setRotation(heading));
            });

            // Init active marker first
            this.activeStation
            .filter(station => !!station)
            .take(1)
            .toPromise()
            .then((activeStation: VlilleStation) => this.initMarker(activeStation))
            .then(marker => {
                // if marker is still in creation, handle promise
                if (marker.then) {
                    marker.then(markerCreated => this.setActiveMarker(markerCreated));
                } else {
                    this.setActiveMarker(marker);
                }

                // init stations marker
                this.stations
                .filter(stations => stations && stations.length > 0)
                .take(1)
                .toPromise()
                .then((stations: VlilleStation[]) => this.initMarkers(stations))
                .then(() => {
                    // hide loading message
                    this.store.dispatch(new ToastActions.Hide());

                    // Run watchers
                    this.startActiveStationWatcher(this.activeStation);
                    this.startStationsStateWatcher(this.stations);
                    this.startZoomLevelWatcher(this.mapInstance);
                });
            });
        });
    }

    /**
     * Initialize map instance and bind it to #map-canvas element.
     *
     * @return {Promise<any>}
     */
    private initMap(): Promise<any> {
        let mapOptions = {
            camera: {
                latLng: AppSettings.defaultPosition,
                zoom: this.mapZoom
            }
        };

        return new Promise<any>((resolve, reject) => {
            this.platform.ready().then(() => {
                // init map instance
                plugin.google.maps.Map
                .getMap(document.getElementById('map-canvas'), mapOptions)
                .one(plugin.google.maps.event.MAP_READY, mapInstance => {
                    this.mapInstance = mapInstance;

                    resolve(mapInstance);
                });
            });
        });
    }

    /**
     * Create stations markers on the map
     *
     * @param  {VlilleStation[]} stations
     * @return {Promise<any>}
     */
    private initMarkers(stations: VlilleStation[]): Promise<any> {
        let promises = [];
        for (let station of stations) {
            promises.push(this.initMarker(station));
        }

        return Promise.all(promises);
    }

    /**
     * Create station marker on the map
     *
     * @param  {VlilleStation} station
     * @return {Promise<any>}
     */
    private initMarker(station: VlilleStation): Promise<any> {
        let existingMarker = this.markers.get(station.id);
        if (existingMarker) {
            return Promise.resolve(existingMarker);
        }

        let promise = new Promise((resolve, reject) => {
            this.mapInstance.addMarker({
                position: {
                    lat: station.latitude,
                    lng: station.longitude
                },
                icon: station.status === VlilleStationStatus.NORMAL ? MapIcon.NORMAL : MapIcon.UNAVAILABLE,
                disableAutoPan: true
            }, marker => {
                this.handleMarkerCreated(marker, station);

                // indicates that markers creation is done
                resolve(marker);
            });
        });

        // set the promise to "lock" the space during marker async creation
        this.markers.set(station.id, promise);

        return promise;
    }

    /**
     * Manage marker after it has been add to the map
     * @param marker
     * @param station
     */
    private handleMarkerCreated(marker: any, station:VlilleStation) {
        let vlilleStationMarker = new VlilleStationMarker(marker, station);

        // stores created marker
        this.markers.set(station.id, vlilleStationMarker);

        // init station status
        // marker.set('isAvailable', station.status === VlilleStationStatus.NORMAL);

        /**
         * Set active marker on click
         */
        vlilleStationMarker.onClick(() => {
            this.setActiveMarker(marker);

            this.setCenter(MapPosition.fromCoordinates(station), true);

            // updates active station
            this.store.dispatch(new StationsActions.UpdateActive(station))
        });
    }

    /**
     *
     * @param  {MapPosition} position
     * @return {Promise<any>}
     */
    private initUserMarker(position: MapPosition): Promise<any> {
        // Create user position marker
        let userMarkerPromise = new Promise<any>((resolve, reject) => {
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

        // Create a circle to represent the user position accuracy
        let userMarkerAccuracyPromise = new Promise<any>((resolve, reject) => {
            this.mapInstance.addCircle({
                center: position.toLatLng(),
                radius: position.accuracy,
                strokeWidth: 0,
                strokeColor: 'rgba(0, 0, 0, 0)',
                fillColor: 'rgba(25, 209, 191, 0.15)' // #19D1BF + opacity = 15%,
            }, markerAccuracy => {
                // avoid duplication bug
                if (this.userMarkerAccuracy) {
                    this.userMarkerAccuracy.remove();
                }

                // updates marker ref
                this.userMarkerAccuracy = markerAccuracy;

                resolve(markerAccuracy);
            });
        });

        // wait for both to be created
        return Promise.all([
            userMarkerPromise,
            userMarkerAccuracyPromise
        ]);
    }

    /**
     * Updates `this.mapIsUnzoom` value according to the given `zoom` value.
     *
     * @param {number} zoom
     */
    private updateDefaultMarker(zoom: number) {
        if (zoom <= ZOOM_THRESHOLD && this.mapZoom > ZOOM_THRESHOLD) {
            // we are "unzooming"
            // change the marker icon for the small one
            this.mapIsUnzoom = true;
        } else if (zoom > ZOOM_THRESHOLD && this.mapZoom <= ZOOM_THRESHOLD) {
            // we are "zooming"
            // change the marker icon for the normal one
            this.mapIsUnzoom = false;
        } else {
            // seems to be the same zoom level
            // nothing to do
            return;
        }

        // refresh on the marker icons
        this.refreshMarkerIcons();

        // stores zoom value
        this.mapZoom = zoom;
    }

    /**
     * Refresh marker icons using the `this.markerIcon` value.
     */
    private refreshMarkerIcons() {
        this.markers.forEach((marker: VlilleStationMarker) => {
            // do not refresh active marker
            if (this.activeMarker && this.activeMarker.isEqual(marker)) {
                return;
            }

            // update marker icon according to zoom and station status
            let isAvailable = marker.isAvailable();
            if (this.mapIsUnzoom) {
                if (isAvailable) {
                    marker.setIcon(MapIcon.NORMAL_SMALL);
                } else {
                    marker.setIcon(MapIcon.UNAVAILABLE_SMALL);
                }
            } else {
                if (isAvailable) {
                    // marker.setIcon(MapIcon.NORMAL);
                    let debug = DynamicMapIcon.getIcon(60);
                    marker.setIcon(debug);
                } else {
                    marker.setIcon(MapIcon.UNAVAILABLE);
                }
            }
        });
    }

    /**
     * Run the active marker watcher through an observable
     *
     * @param {Observable<VlilleStation>} activeStationObservable
     */
    private startActiveStationWatcher(activeStationObservable: Observable<VlilleStation>) {
        activeStationObservable
        .filter(station => !!station)
        .subscribe(station => {
            let marker = this.markers.get(station.id);

            // avoid double call to setActiveMarker during marker click
            if (this.activeMarker && this.activeMarker.isEqual(marker)) {
                return;
            }

            this.setActiveMarker(marker);
        });
    }

    /**
     * Run the stations watcher through an observable
     *
     * @param {Observable<VlilleStation[]>} stationsObservable
     */
    private startStationsStateWatcher(stationsObservable: Observable<VlilleStation[]>) {
        stationsObservable
        .filter(stations => stations && stations.length > 0)
        .subscribe((stations: VlilleStation[]) => {
            // update marker state
            stations.forEach(station => {
                let marker = this.markers.get(station.id);

                // updates marker data
                // marker.set('isAvailable', station.status === VlilleStationStatus.NORMAL);
            });
        });
    }

    /**
     * Run the map zoom level watcher through map plug event.
     *
     * @param {google.maps.Map} mapInstance
     */
    private startZoomLevelWatcher(mapInstance) {
        // listen for camera changes
        mapInstance.on(plugin.google.maps.event.CAMERA_MOVE_END, event => {
            // zoom unchanged, nothing to do
            if (event.zoom === this.mapZoom) {
                return;
            }

            this.updateDefaultMarker(event.zoom)
        });
    }

    /**
     *
     * @param {google.maps.Marker} marker
     */
    private setActiveMarker(marker: any) {
        // reset default icon on current office marker
        if (this.activeMarker && !this.activeMarker.isEqual(marker)) {
            if (this.activeMarker.isAvailable()) {
                this.activeMarker.setIcon(MapIcon.NORMAL);
            } else {
                this.activeMarker.setIcon(MapIcon.UNAVAILABLE);
            }
        }

        // set new marker
        this.activeMarker = marker;

        // updates marker icon according to station state
        if (this.activeMarker.isAvailable()) {
            this.activeMarker.setIcon(MapIcon.NORMAL_ACTIVE);
        } else {
            this.activeMarker.setIcon(MapIcon.UNAVAILABLE_ACTIVE);
        }
    }

    /**
     * @param {MapPosition} position
     */
    private setUserPosition(position: MapPosition) {
        this.userMarker.setPosition(position.toLatLng());

        // displays accuracy
        this.userMarkerAccuracy.setCenter(position.toLatLng());
        this.userMarkerAccuracy.setRadius(position.accuracy);
    }

    /**
     * Public methods
     */

    /**
     *
     * @param {boolean} value
     */
    public setClickable(value: boolean) {
        if (!this.mapInstance) {
            return;
        }

        this.mapInstance.setClickable(value);
    }

    /**
     *
     * @param {MapPosition} position
     */
    public setCenter(position: MapPosition, animate: boolean = false) {
        if (!this.mapInstance) {
            return;
        }

        let options = {
            target: position.toLatLng(),
            zoom: 16
        };

        if (animate) {
            (<any>options).duration = 200;

            this.mapInstance.animateCamera(options);
        } else {
            this.mapInstance.moveCamera(options);
        }
    }
}
