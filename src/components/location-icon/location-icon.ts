import { Component, Input } from '@angular/core';

export enum LocationIconState {
    Default,
    Loading,
    Fixed,
    Disabled
}

@Component({
    selector: 'location-icon',
    templateUrl: './location-icon.html'
})

export class LocationIcon {
    public enumState = LocationIconState;

    @Input() state: LocationIconState = LocationIconState.Default;
}