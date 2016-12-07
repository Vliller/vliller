import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../../services/vlille/vlille';

@Component({
    selector: 'favorites-button',
    templateUrl: './favorites-button.html'
})

export class FavoritesButton {
    @Input() favoriteStations: Observable<VlilleStation[]>;

    constructor() {}
}