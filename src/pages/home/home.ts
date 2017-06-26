import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController, ToastController, Platform, ModalController } from 'ionic-angular';
import * as Raven from 'raven-js';

import { VlilleService, VlilleStation } from '../../services/vlille/vlille';
import { FavoritesService } from '../../services/favorites/favorites';
import { LocationService } from '../../services/location/location';
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
    private activeStationSubject = new ReplaySubject<VlilleStation>(1);
    public isActiveStationRefreshing: boolean = false;

    @ViewChild('map') map: Map;

    constructor(
        private platform: Platform,
        private vlilleService: VlilleService,
        private mapService: MapService,
        private favoritesService: FavoritesService,
        private locationService: LocationService,
        private alertController: AlertController,
        private toastController: ToastController,
        private modalController: ModalController
    ) {
        this.stations = vlilleService.getAllStations();

        this.activeStation = this.activeStationSubject.asObservable();
        this.favoriteStations = favoritesService.asObservable();
        this.currentPosition = locationService.asObservable();

        // gets initial position
        this.locationService.requestLocation()
        .then(() => this.updatePosition())
        .catch(error => this.handleLocationError(error));

        // Updates activeStation according to user position
        this.stations.subscribe(stations => this.currentPosition.subscribe(position => {
            // computes and actives the closest station
            let closestStation = this.mapService.computeClosestStation(position, stations);

            // updates active station
            this.setActiveStation(closestStation, false);
        }));

        // Hide splashscreen
        this.platform.ready().then(() => new SplashScreen().hide());
    }

    /**
     * Manage location error
     * @param {any} error
     */
    private handleLocationError(error: any) {
        // Android only
        if (error && error.code !== new LocationAccuracy().ERROR_USER_DISAGREED) {

            // open popup asking for settings
            return this.alertController.create({
                title: 'Vliller a besoin de votre position',
                message: "Impossible d'activer le GPS automatiquement. Voulez-vous ouvrir les préférences et activer la localisation \"haute précision\" manuellement ?",
                buttons: [{
                    text: 'Annuler',
                    handler: () => {
                        throw {
                          code: new LocationAccuracy().ERROR_USER_DISAGREED
                        };
                    }
                },
                {
                    text: 'Ouvrir les paramètres',
                    handler: () => new Diagnostic().switchToLocationSettings()
                }]
            }).present();
        }

        // else, sends error to Sentry
        Raven.captureException(new Error(error));
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
        this.activeStationSubject.next(station);

        // fetch 'fresh' station date
        this.isActiveStationRefreshing = true;
        this.fetchStationWithDistance(station.id)
        .then(station => this.activeStationSubject.next(station))
        .catch(error => Raven.captureException(new Error(error)))
        .then(() => this.isActiveStationRefreshing = false);

        //
        if (centerMap) {
            this.map.setCenter(MapPosition.fromCoordinates(station), true);
        }
    }

    /**
     * Get fresh station information and compute distance attribute
     *
     * @param  {string}                 stationId
     * @return {Promise<VlilleStation>}
     */
    private fetchStationWithDistance(stationId: string): Promise<VlilleStation> {
        let stationPromise = this.vlilleService.getStation(stationId).toPromise();
        let currentPositionPromise = this.locationService.getCurrentPosition();

        return Promise.all([
            stationPromise,
            currentPositionPromise
        ])
        .then(values => {
            let station = values[0];
            let stationPosition = MapPosition.fromCoordinates(station);
            let position = values[1];

            //  compute distance between station and current user position
            station.distance = this.mapService.getDistance(position, stationPosition);

            return station;
        });
    }

    /**
     * Update user position or show a toast if an error appeared.
     */
    public updatePosition() {
        this.locationState = LocationIconState.Loading;

        this.locationService.updateCurrentPosition()
        .then(() => this.locationState = LocationIconState.Default)
        .catch(error => {
            if (error === 'locationDisabled') {
                this.toastController.create({
                    message: 'Vous devez activer votre GPS pour utiliser cette fonctionnalité.',
                    showCloseButton: true,
                    closeButtonText: 'OK'
                }).present();

                this.locationState = LocationIconState.Disabled;

                return error;
            }

            // else, sends error to Sentry
            Raven.captureException(new Error(error));

            // reset icon to default value
            this.locationState = LocationIconState.Default
        });
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
