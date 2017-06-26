import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'cb-icon',
    templateUrl: './cb-icon.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CbIcon {
    @Input() active: boolean;
}