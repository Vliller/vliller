import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { VlilleStationResume } from '../../components/vlille/vlille';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    stations: VlilleStationResume[];

    constructor(public navCtrl: NavController) {

    }
}
