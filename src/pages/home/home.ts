import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController, ToastController, Platform, ModalController } from 'ionic-angular';

import {
    AppState,
    selectFavorites,
    selectStations,
    selectActiveStation,
    selectIsLoadingActiveStation,
    selectCurrentPosition,
    selectCurrentPositionIsLoading
} from '../../app/app.reducers';
import { Store } from '@ngrx/store';
import { StationsActions } from '../../actions/stations';
import { LocationActions } from '../../actions/location';

import { VlilleStation } from '../../models/vlille-station';
import { MapPosition } from '../../models/map-position';
import { MapComponent } from '../../components/map/map';
import { MapService } from '../../services/map';
import { LocationIconState } from '../../components/location-icon/location-icon';
import { CodeMemo } from '../code-memo/code-memo';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    public stations: Observable<VlilleStation[]>;
    public favoriteStations: Observable<VlilleStation[]>;
    public currentPosition: Observable<MapPosition>;
    public locationState: LocationIconState = LocationIconState.Default;

    public activeStation: Observable<VlilleStation>;
    public isActiveStationRefreshing: Observable<boolean>;

    @ViewChild('map') map: MapComponent;

    constructor(
        private platform: Platform,
        private mapService: MapService,
        private alertController: AlertController,
        private toastController: ToastController,
        private modalController: ModalController,
        private store: Store<AppState>,
        private splashScreenPlugin: SplashScreen
    ) {
        // get streams
        this.stations = store.select(state => selectStations(state));
        this.activeStation = store.select(state => selectActiveStation(state));
        this.isActiveStationRefreshing = store.select(state => selectIsLoadingActiveStation(state));
        this.favoriteStations = store.select(state => selectFavorites(state));

        this.currentPosition = store.select(state => selectCurrentPosition(state));

        // watch location loading
        store.select(state => selectCurrentPositionIsLoading(state)).subscribe(isLoading => this.locationState = isLoading ? LocationIconState.Loading : LocationIconState.Default);

        // Updates activeStation according to user position
        this.currentPosition.withLatestFrom(
            // get non-empty stations collection
            this.stations.filter(stations => stations && stations.length > 0),

            // computes closest station
            (position, stations) => {
                return this.mapService.computeClosestStation(position, stations);
            }
        ).subscribe(closestStation => {
            // updates active station
            this.setActiveStation(closestStation, false);
        });

        // update position on resume
        this.platform.resume.subscribe(() => this.updatePosition());

        // Hide splashscreen
        this.platform.ready().then(() => this.splashScreenPlugin.hide());
    }

    /**
     * Put new value in activeStation stream
     * Also, center the map by default.
     *
     * @param {VlilleStation} stationResume
     * @param {boolean} centerMap
     */
    public setActiveStation(station: VlilleStation, centerMap: boolean = true) {
        // immediately set 'cold' data, to get fast UI updates
        this.store.dispatch(new StationsActions.SetActive(station));

        // Update station data
        this.store.dispatch(new StationsActions.UpdateActive(station));

        //
        if (centerMap) {
            this.map.setCenter(MapPosition.fromCoordinates(station), true);
        }
    }

    /**
     * Update user position
     */
    public updatePosition() {
        this.store.dispatch(new LocationActions.Update());
    }

    /**
     *
     */
    public openCodeMemoPage() {
        this.modalController.create(CodeMemo).present();
    }
}
