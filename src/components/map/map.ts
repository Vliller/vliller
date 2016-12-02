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
    private markers: any;

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
            this.initStations(stations);
        });

        this.setCenterMap(DEFAULT_POSITION);
    }

    private initStations(stations: VlilleStationResume[]) {
        // avoids function declaration inside loop
        function callback(marker) {
            // store list of markers
            this.markers.push(marker);

            /**
             * addMarker is async, so we need to wait until all the marker are adds to the map.
             * @see https://github.com/mapsplugin/cordova-plugin-googlemaps/wiki/Marker#create-multiple-markers
             */
            // if (this.markers.length !== stations.length) {
            //     return;
            // }

            // all markers are init
            // vm.isMapLoaded = true;

            // request to active location if needed
            // Location.requestLocation().then(function () {
            //     // update GPS position
            //     vm.updatePosition();
            // }, function (error) {
            //     // center map on Lille if the user do not active is GPS
            //     setCenterMap(DEFAULT_POSITION);

            //     // Android only
            //     if (error && error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {

            //         // disables
            //         map.setClickable(false);

            //         // open popup asking for settings
            //         return $ionicPopup.confirm({
            //             title: "Vliller a besoin de votre position",
            //             template: "Impossible d'activer le GPS automatiquement. Voullez-vous ouvrir les préférences et l'activer la localisation \"haute précision\" manuellement ?",
            //             cancelText: "Annuler",
            //             okText: "Ouvrir les paramètres"
            //         }).then(function (confirm) {
            //             // enables map click
            //             map.setClickable(true);

            //             // open location settings
            //             if (confirm) {
            //                 cordova.plugins.diagnostic.switchToLocationSettings();
            //             } else {
            //                 // throw an error
            //                 throw {
            //                     code: cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED
            //                 };
            //             }
            //         });
            //     }
            // });
        }

        // adds stations markers on map
        for(let station of stations) {
            this._mapInstance.addMarker({
                position: {
                    lat: station.latitude,
                    lng: station.longitude
                },
                // icon: iconDefault,
                station: station,
                disableAutoPan: true,
                // markerClick: markerClick
            }, callback);
        }
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
