import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.reducers';
import { MapActions } from '../../actions/map';

import { VlilleStation } from '../../models/vlille-station';

@Component({
    selector: 'station-card',
    templateUrl: './station-card.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class StationCard {
    @Input() station: VlilleStation;
    @Input() isLoading: boolean = true;

    constructor(private store: Store<AppState>) {}

    public unExpandMap() {
        this.store.dispatch(new MapActions.SetExpanded(false));
    }
}
