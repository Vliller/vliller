import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { VlilleService, VlilleStationResume } from '../../components/vlille/vlille';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    stations: Observable<VlilleStationResume[]>;

    constructor(
        public navCtrl: NavController,
        private vlilleService: VlilleService
    ) {
        this.stations = vlilleService.getAll();
    }
}
