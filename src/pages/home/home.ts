import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { VlilleService, VlilleStationResume, VlilleStation } from '../../components/vlille/vlille';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    public stations: Observable<VlilleStationResume[]>;
    public activeStation: Observable<VlilleStation>;

    private activeStationSubject = new Subject<VlilleStation>();

    constructor(
        public navCtrl: NavController,
        private vlilleService: VlilleService
    ) {
        this.activeStation = this.activeStationSubject.asObservable();

        this.stations = vlilleService.getAllStations();
    }

    public setActiveStation(stationResume: VlilleStationResume) {
        this.vlilleService.getStation(stationResume.id).subscribe(
            // update station value through observer
            stationDetails => this.activeStationSubject.next(VlilleStation.createFromResumeAndDetails(stationResume, stationDetails))
        );
    }
}
