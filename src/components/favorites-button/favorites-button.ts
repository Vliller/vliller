import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
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
    @Output() favoriteStationClick = new EventEmitter<VlilleStation>();

    constructor() {}

    ngOnInit() {
        // close the FAB on content update to avoid eventual render bug.
        this.favoriteStations.subscribe(stations => {
            this.fabContainer.close();
        });
    }

    public favoriteClick(station: VlilleStation) {
        this.favoriteStationClick.emit(station);
        this.fabContainer.close();
    }
}