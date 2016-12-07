import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { VlilleStationResume } from '../vlille/vlille';

declare var plugin: any;

const DEFAULT_POSITION = {
    latitude: 50.633333,
    longitude: 3.066667
};

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
    }
};

@Component({
    selector: 'map',
    template: `<div id="map-canvas" class="map-canvas"></div>`
})

export class Map implements OnInit {
    private mapInstance: any;
    private mapInstanceObserver: Observable<any>;

    private markers: any;
    private markerIcon: any;
    private activeMarker: any;

    @Input() stations: Observable<VlilleStationResume[]>;
    @Output() activeStationChange = new EventEmitter<VlilleStationResume>();

    constructor(private platform: Platform) {
        this.markers = [];
        this.markerIcon = MapIcon.NORMAL;

        this.mapInstanceObserver = this.prepareMapInstance();
    }

    ngOnInit() {
        // wait for map instance to be initialized
        this.mapInstanceObserver.subscribe(mapInstance => {
            this.mapInstance = mapInstance;

            // get stations list
            this.stations.subscribe((stations: VlilleStationResume[]) => this.initStations(stations));

            // center map by default
            this.setCenterMap(DEFAULT_POSITION);
        });
    }

    /**
     * Initialize map instance and bind it to #map-canvas element
     * @return {Observable<any>}
     */
    private prepareMapInstance(): Observable<any> {
        return new Observable<any>(
            observer => {
                this.platform.ready().then(() => {
                    // init map instance
                    plugin.google.maps.Map
                        .getMap(document.getElementById('map-canvas'))
                        .one(plugin.google.maps.event.MAP_READY, observer.next.bind(observer));
                });
            }
        );
    }

    /**
     * Put stations marker on map
     * @param {VlilleStationResume[]} stations
     */
    private initStations(stations: VlilleStationResume[]) {
        // avoids function declaration inside loop
        function callback(marker) {
            // store list of markers
            this.markers.push(marker);

            /**
             * Set active marker on click
             */
            marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
                this.setActiveMarker(marker);
            });

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
            this.mapInstance.addMarker({
                position: {
                    lat: station.latitude,
                    lng: station.longitude
                },
                icon: this.markerIcon,
                station: station,
                disableAutoPan: true
            }, callback.bind(this));
        }
    }

    /**
     *
     * @param {any} position
     */
    private setCenterMap(position: any) {
        this.mapInstance.animateCamera({
            target: {
                lat: position.latitude,
                lng: position.longitude
            },
            zoom: 16,
            duration: 1000
        });
    }

    /**
     *
     * @param {google.maps.Marker} marker
     * @param {boolean} centerMap
     */
    private setActiveMarker(marker: any, centerMap: boolean = true) {
        let activeStation = marker.get('station');

        // set default icon on current office marker
        if (this.activeMarker && this.activeMarker.id !== marker.id) {
            this.activeMarker.setIcon(this.markerIcon);
        }

        // update new active office
        this.activeMarker = marker;
        this.activeStationChange.emit(activeStation);

        // center map
        if (centerMap) {
            this.setCenterMap(activeStation);
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
}
