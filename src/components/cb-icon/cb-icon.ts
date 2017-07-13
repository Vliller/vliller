import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'cb-icon',
    template: `
        <img *ngIf="active" class="img-responsive" src="assets/img/vliller-icon-cb.svg">
        <img *ngIf="!active" class="img-responsive" src="assets/img/vliller-icon-no-cb.svg">
    `,
    styles: [`
        :host {
            display: block;
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CbIcon {
    @Input() active: boolean;
}