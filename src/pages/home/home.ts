import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { VlilleService, VlilleStationResume, VlilleStationDetails } from '../../components/vlille/vlille';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    public stations: Observable<VlilleStationResume[]>;
    public activeStation: Observable<VlilleStationDetails>;

    constructor(
        public navCtrl: NavController,
        private vlilleService: VlilleService
    ) {
        this.stations = vlilleService.getAllStations();

        // TMP
        this.activeStation = new Observable(observer => {
            this.stations.subscribe(stations => {
                vlilleService.getStation(stations[0].id).subscribe(station => observer.next(station));
            });
        });
    }
}
