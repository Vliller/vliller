import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export enum LocationIconState {
    Default,
    Loading,
    Fixed,
    Disabled
}

@Component({
    selector: 'location-icon',
    templateUrl: './location-icon.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LocationIcon {
    public enumState = LocationIconState;

    @Input() state: LocationIconState = LocationIconState.Default;
}