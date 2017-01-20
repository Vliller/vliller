import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FabContainer } from 'ionic-angular';

import { VlilleStation } from '../../services/vlille/vlille';

@Component({
    selector: 'favorites-button',
    templateUrl: './favorites-button.html'
})

export class FavoritesButton implements OnInit {
    @ViewChild('fab') fabContainer: FabContainer;
    @Input() favoriteStations: Observable<VlilleStation[]>;

    constructor() {}

    ngOnInit() {
        // close the FAB on content update to avoid eventual render bug.
        this.favoriteStations.subscribe(stations => {
            this.fabContainer.close();
        });
    }
}