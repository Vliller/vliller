import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { VlilleStation } from '../../services/vlille/vlille';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html'
})

export class StationCard {
    @Input() station: VlilleStation;
    @Input() isLoaded: boolean = true;
}
