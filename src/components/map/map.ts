import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { VlilleStationResume } from '../../services/vlille/vlille';
import { Position } from '../../services/location/location';

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

// const MAPBOX_API_BASE = 'https://api.mapbox.com/directions/v5/mapbox/walking/';
// const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYmxja3NocmsiLCJhIjoiY2l5YWc5anUyMDA0cDMzcWtxcnN0ZWxxcCJ9.xKDTqbkNCQTRvizwIDGeCQ';

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
    private userMarker: any;

    @Input() stations: Observable<VlilleStationResume[]>;
    @Input() userPosition: Observable<Position>;
    @Output() activeStationChange = new EventEmitter<VlilleStationResume>();

    constructor(
        private platform: Platform,
        private http: Http
    ) {
        this.markers = [];
        this.markerIcon = MapIcon.NORMAL;

        this.mapInstanceObserver = this.prepareMapInstance();
    }

    ngOnInit() {
        // wait for map instance to be initialized
        this.mapInstanceObserver.subscribe(mapInstance => {
            this.mapInstance = mapInstance;

            this.setCenterMap(DEFAULT_POSITION);
            this.initUserMarker(DEFAULT_POSITION);

            // init stations marker
            this.stations.subscribe((stations: VlilleStationResume[]) => this.initStations(stations));

            // listen for user position
            this.userPosition.subscribe(position => {
                this.setUserPosition(position.coords);
                this.setCenterMap(position.coords);
            })
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

    /**
     *
     * @param {any} position
     */
    private initUserMarker(position: any) {
        this.mapInstance.addMarker({
            position: {
                lat: position.latitude,
                lng: position.longitude
            },
            icon: MapIcon.USER,
            disableAutoPan: true
        }, marker => {
            // avoid duplication bug
            if (this.userMarker) {
                this.userMarker.remove();
            }

            // updates marker ref
            this.userMarker = marker;

            // updates heading
            // ionic.requestAnimationFrame(updateUserHeading);
        });
    }

    /**
     *
     * @param {any} position
     */
    private setUserPosition(position: any) {
        this.userMarker.setPosition({
            lat: position.latitude,
            lng: position.longitude
        });
    }

    // private computePreciseDistance(start: any, end: any): Observable<number> {
    //     return this.http
    //     .get(MAPBOX_API_BASE + start.longitude + ',' + start.latitude + ';' + end.longitude + ',' + end.latitude + '?overview=false&access_token=' + MAPBOX_ACCESS_TOKEN)
    //     .map(response => {
    //         let direction = response.json();

    //         if (direction.routes && direction.routes[0]) {
    //             return direction.routes[0].distance;
    //         } else {
    //             return -1;
    //         }
    //     });
    // }
}
