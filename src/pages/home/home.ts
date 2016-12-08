import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { VlilleService, VlilleStationResume, VlilleStation } from '../../services/vlille/vlille';
import { FavoritesService } from '../../services/favorites/favorites';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    public stations: Observable<VlilleStationResume[]>;
    private activeStationSubject = new Subject<VlilleStation>();
    public activeStation: Observable<VlilleStation>;;
    public favoriteStations: Observable<VlilleStation[]>;

    constructor(
        private vlilleService: VlilleService,
        private favoritesService: FavoritesService
    ) {
        this.activeStation = this.activeStationSubject.asObservable();

        this.stations = vlilleService.getAllStations();

        this.favoriteStations = favoritesService.asObservable();
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
