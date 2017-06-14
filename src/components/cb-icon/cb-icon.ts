import { Component, Input } from '@angular/core';

@Component({
    selector: 'cb-icon',
    templateUrl: './cb-icon.html'
})

export class CbIcon {
    @Input() active: boolean;

    constructor() {}
}