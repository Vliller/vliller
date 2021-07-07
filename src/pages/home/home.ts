import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { filter, withLatestFrom } from 'rxjs/operators';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform, ModalController } from 'ionic-angular';

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
import { ToastActions } from '../../actions/toast';

import { VlilleStation } from '../../models/vlille-station';
import { MapPosition } from '../../models/map-position';
import { MapComponent } from '../../components/map/map';
import { MapTools } from '../../components/map/map-tools';
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
        platform: Platform,
        splashScreenPlugin: SplashScreen,
        private modalController: ModalController,
        private store: Store<AppState>
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
        this.currentPosition
        .pipe(
            withLatestFrom(
                // get non-empty stations collection
                this.stations
                .pipe(
                    filter(stations => stations && stations.length > 0)
                ),

                // computes closest station
                (position, stations) => {
                    return MapTools.computeClosestStation(position, stations);
                }
            )
        )
        .subscribe(closestStation => {
            // refresh station data
            this.store.dispatch(new StationsActions.UpdateActive(closestStation));
        });

        // update position & stations data on resume
        platform.resume.subscribe(() => {
            this.updateData();
        });

        // Hide splashscreen
        platform.ready().then(() => splashScreenPlugin.hide());
    }

    /**
     * Update user position
     */
    public updateData() {
        // show loader
        this.store.dispatch(new ToastActions.Show({
            message: "Ça pédale pour charger les stations&nbsp;!",
            options: {
                showSpinner: true
            }
        }));

        this.store.dispatch(new StationsActions.Load());
        this.store.dispatch(new LocationActions.Update());
    }

    /**
     *
     */
    public openCodeMemoPage() {
        this.modalController.create(CodeMemo).present();
    }
}
