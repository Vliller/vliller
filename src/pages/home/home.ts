import { Component } from '@angular/core';
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
    public activeStation: Observable<VlilleStation>;;
    public favoriteStations: Observable<VlilleStation[]>;
    public currentPosition: Observable<Position>;

    private activeStationSubject = new Subject<VlilleStation>();

    constructor(
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

        // get station details
        this.vlilleService.getStation(stationResume.id).subscribe(
            // update station value through observer
            stationDetails => this.activeStationSubject.next(VlilleStation.createFromResumeAndDetails(stationResume, stationDetails))
        );
    }
}
