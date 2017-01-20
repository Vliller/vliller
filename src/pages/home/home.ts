import { Component, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { VlilleService, VlilleStationResume, VlilleStation } from '../../services/vlille/vlille';
import { FavoritesService } from '../../services/favorites/favorites';
import { LocationService, Position } from '../../services/location/location';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    public stations: Observable<VlilleStationResume[]>;
    public activeStation: Observable<VlilleStation>;
    public favoriteStations: Observable<VlilleStation[]>;
    public currentPosition: Observable<Position>;

    private activeStationSubject = new Subject<VlilleStation>();

    constructor(
        private zone: NgZone,
        private vlilleService: VlilleService,
        private favoritesService: FavoritesService,
        private locationService: LocationService
    ) {
        this.stations = vlilleService.getAllStations();

        this.activeStation = this.activeStationSubject.asObservable();
        this.favoriteStations = favoritesService.asObservable();
        this.currentPosition = locationService.asObservable();

        // gets initial position
        locationService.updateCurrentPosition();
    }

    /**
     *
     * @param {VlilleStationResume} stationResume
     */
    public setActiveStation(stationResume: VlilleStationResume) {
        // clear previous value to start loader
        this.activeStationSubject.next();

        // put the service request inside the NgZone to perform automatic view update
        // @see http://stackoverflow.com/a/37028716/5727772
        this.zone.run(() => {
            // get station details
            this.vlilleService.getStation(stationResume.id).subscribe(
                // update station value through observer
                stationDetails => this.activeStationSubject.next(VlilleStation.createFromResumeAndDetails(stationResume, stationDetails))
            );
        });
    }
}
