import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController, ToastController, Platform, ModalController } from 'ionic-angular';
import * as Raven from 'raven-js';

import {
    AppState,
    selectFavorites,
    selectStations,
    selectActiveStation,
    selectCurrentPosition,
    selectCurrentPositionIsLoading
} from '../../app/app.reducers';
import { Store } from '@ngrx/store';
import { StationsActions } from '../../actions/stations';
import { LocationActions } from '../../actions/location';

import { VlilleStation } from '../../models/vlillestation';
import { Map } from '../../components/map/map';
import { MapPosition } from '../../components/map/map-position';
import { MapService } from '../../services/map/map';
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
    public isActiveStationRefreshing: boolean = false;

    @ViewChild('map') map: Map;

    constructor(
        private platform: Platform,
        private mapService: MapService,
        private alertController: AlertController,
        private toastController: ToastController,
        private modalController: ModalController,
        private store: Store<AppState>
    ) {
        this.stations = store.select(state => selectStations(state));
        this.activeStation = store.select(state => selectActiveStation(state));

        this.currentPosition = store.select(state => selectCurrentPosition(state));
        // watch location loading
        store.select(state => selectCurrentPositionIsLoading(state)).subscribe(isLoading => this.locationState = isLoading ? LocationIconState.Loading : LocationIconState.Default);

        this.favoriteStations = store.select(state => selectFavorites(state));

        // Updates activeStation according to user position
        this.stations

        // removes request with empty result
        .filter(stations => stations && stations.length > 0)

        // compute closest station
        .switchMap(stations => new Observable<VlilleStation>(observer => this.currentPosition.subscribe(position => {
                let closestStation = this.mapService.computeClosestStation(position, stations);

                if (closestStation) {
                    observer.next(closestStation);
                }
            })
        ))

        // updates active station
        .subscribe(closestStation => {

            this.setActiveStation(closestStation, false);
        });

        // Hide splashscreen
        this.platform.ready().then(() => new SplashScreen().hide());
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
     * Update user position or show a toast if an error appeared.
     */
    public updatePosition() {
        this.store.dispatch(new LocationActions.Update());
    }

    /**
     *
     * @param {boolean} isClickable
     */
    public setMapClickable(isClickable: boolean) {
        this.mapService.setMapClickable(isClickable);
    }

    /**
     *
     */
    public openCodeMemoPage() {
        let modal = this.modalController.create(CodeMemo);

        modal.onDidDismiss(() => {
            this.mapService.setMapClickable(true);
        });

        this.mapService.setMapClickable(false);
        modal.present();
    }
}
