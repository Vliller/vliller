import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { VlilleStation } from '../../models/vlillestation';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class StationCard {
    @Input() station: VlilleStation;
    @Input() isLoaded: boolean = true;
}
