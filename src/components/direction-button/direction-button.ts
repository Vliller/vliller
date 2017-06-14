import { Component, Input } from '@angular/core';

@Component({
    selector: 'direction-button',
    templateUrl: './direction-button.html'
})

export class DirectionButton {

    @Input() coordinates: any;

    constructor() {}

    startNavigation() {
        // TODO
    }
}