import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { VlilleStation } from '../../components/vlilles/vlille-station';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class Home {
    stations: VlilleStation[];

    constructor(public navCtrl: NavController) {

    }
}
