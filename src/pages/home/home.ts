import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { VlilleService, VlilleStationResume, VlilleStation } from '../../components/vlille/vlille';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    public stations: Observable<VlilleStationResume[]>;
    public activeStation: Observable<VlilleStation>;;

    private activeStationSubject = new Subject<VlilleStation>();

    constructor(private vlilleService: VlilleService) {
        this.activeStation = this.activeStationSubject.asObservable();

        this.stations = vlilleService.getAllStations();
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

    /**
     *
     * @param {boolean} isFavorite
     */
    public setActiveStationFavorite(isFavorite: boolean) {
        // TODO: update favorites list
        console.log(isFavorite)
    }
}
