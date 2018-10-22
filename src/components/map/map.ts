import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { map, filter, take } from 'rxjs/operators';
import { DeviceOrientation } from '@ionic-native/device-orientation';

import { MapPosition } from '../../models/map-position';
import { VlilleStation } from '../../models/vlille-station';
import { VlilleStationMarker } from '../../models/vlille-station-marker';
import { UserMarker } from '../../models/user-marker';

import { AppSettings } from '../../app/app.settings';
import { Store } from '@ngrx/store';
import { AppState, selectMapIsClickable } from '../../app/app.reducers';
import { ToastActions } from '../../actions/toast';
import { StationsActions } from '../../actions/stations';

declare var plugin: any;

const ZOOM_DEFAULT = 12;

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

    private markers: Map<number, VlilleStationMarker> = new Map();
    private activeMarker: VlilleStationMarker;

    private userMarker: UserMarker;
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
            .pipe(
                map(compassHeading => compassHeading.magneticHeading),
                filter(heading => !!heading)
            );
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
                    this.userMarker.setPosition(position);
                    this.setCenter(position);
                });

                // listen for user heading
                this.userHeading.subscribe(heading => {
                    this.userMarker.setHeading(heading);
                });
            });

            // Init active marker first
            this.activeStation
            .pipe(
                filter(station => !!station),
                take(1)
            )
            .toPromise()
            .then((activeStation: VlilleStation) => this.initMarker(activeStation))
            .then((marker: VlilleStationMarker) => {
                // first, set active marker
                this.setActiveMarker(marker);

                // then, init stations marker
                this.stations
                .pipe(
                    filter(stations => stations && stations.length > 0),
                    take(1)
                )
                .toPromise()
                .then((stations: VlilleStation[]) => this.initMarkers(stations))
                .then(() => {
                    // hide loading message
                    this.store.dispatch(new ToastActions.Hide());

                    // Run watchers
                    this.startActiveStationWatcher(this.activeStation);
                    this.startStationsStateWatcher(this.stations);
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
     * @return {Promise<VlilleStationMarker[]>}
     */
    private initMarkers(stations: VlilleStation[]): Promise<VlilleStationMarker[]> {
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
     * @return {Promise<VlilleStationMarker>}
     */
    private initMarker(station: VlilleStation): Promise<VlilleStationMarker> {
        let marker = this.markers.get(station.id);
        if (marker) {
            return Promise.resolve(marker);
        }

        return VlilleStationMarker.create(this.mapInstance, station).then(stationMarker => {
            // stores created marker
            this.markers.set(station.id, stationMarker);

            /**
             * Set active marker onClick event
             */
            stationMarker.onClick().subscribe(() => {
                this.setActiveMarker(stationMarker);
                this.setCenter(MapPosition.fromCoordinates(station), true);

                // updates active station
                this.store.dispatch(new StationsActions.UpdateActive(station))
            });

            return stationMarker;
        });
    }

    /**
     *
     * @param  {MapPosition} position
     * @return {Promise<UserMarker>}
     */
    private initUserMarker(position: MapPosition): Promise<UserMarker> {
        return UserMarker.create(this.mapInstance, MapPosition.fromLatLng(AppSettings.defaultPosition)).then((marker: UserMarker) => {
            // avoid duplication bug
            if (this.userMarker) {
                this.userMarker.removeMarker();
            }

            // updates marker ref
            this.userMarker = marker;

            return this.userMarker;
        });
    }

    /**
     * Run the active marker watcher through an observable
     *
     * @param {Observable<VlilleStation>} activeStationObservable
     */
    private startActiveStationWatcher(activeStationObservable: Observable<VlilleStation>) {
        activeStationObservable
        .pipe(
            filter(station => !!station)
        )
        .subscribe(station => {
            let marker = this.markers.get(station.id);

            // avoid double call to setActiveMarker during marker click
            if (marker.isActive()) {
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
        .pipe(
            filter(stations => stations && stations.length > 0)
        )
        .subscribe((stations: VlilleStation[]) => {
            // update marker state
            stations.forEach(station => {
                let marker = this.markers.get(station.id);

                // updates marker data & icon
                marker.setStation(station);
                marker.updateIcon();
            });

            // hide loading message
            this.store.dispatch(new ToastActions.Hide());
        });
    }

    /**
     *
     * @param {VlilleStationMarker} marker
     */
    private setActiveMarker(marker: VlilleStationMarker) {
        if (marker.isActive()) {
            return;
        }

        // reset default icon on current office marker
        if (this.activeMarker) {
            this.activeMarker.setActive(false);
            this.activeMarker.updateIcon();
        }

        // pimp new marker
        marker.setActive(true);
        marker.updateIcon();

        // update local reference
        this.activeMarker = marker;
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
