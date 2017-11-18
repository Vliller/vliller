import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PieChart implements OnChanges {
    @Input() value: number;

    ngOnChanges() {

    }
}