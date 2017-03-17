import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'station-card-metric',
    templateUrl: './station-card-metric.html'
})

export class StationCardMetric implements OnInit {
    public iconUrl: string;
    public color: string;
    public text: string;

    @Input() type: string;
    @Input() value: number;

    constructor() {}

    ngOnInit() {
        if (this.type !== 'bike' && this.type !== 'dock') {
            throw new Error('Illegal type value ! Should be "bike" or "dock"');
        }

        this.color = this.computeColor(this.value);
        this.iconUrl = this.computeIconUrl(this.type, this.color);
        this.text = this.computeText(this.type, this.value);
    }

    /**
     * Compute color according to the given number.
     * 0        : red,
     * ]0, 5]   : orange,
     * ]5, inf[ : green
     *
     * @param  {number} value
     * @return {string}
     */
    private computeColor(value: number): string {
        if (value <= 3) {
            return 'red';
        }

        if (value <= 5) {
            return 'orange';
        }

        return 'green';
    };

    /**
     * [computeIconUrl description]
     * @param  {string} type  [description]
     * @param  {string} color [description]
     * @return {string}       [description]
     */
    private computeIconUrl(type: string, color: string): string {
        return 'assets/img/vliller_' + type + '-' + color + '.png';
    }

    /**
     * [computeText description]
     * @param  {string} type   [description]
     * @param  {number} value [description]
     * @return {string}        [description]
     */
    private computeText(type: string, value: number): string {
        if (type === 'bike') {
            return value > 1 ? 'vélos disponibles' : 'vélo disponible';
        } else if (type === 'dock') {
            return value > 1 ? 'places disponibles' : 'place disponible';
        } else {
            throw new Error('Illegal type value ! Should be "bike" or "dock"');
        }
    }
}