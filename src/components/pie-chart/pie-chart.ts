import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PieChart implements OnChanges {
  @Input() value: number;

  strokeDasharray: string;

  ngOnChanges() {
    this.strokeDasharray = this.computeStrokeDasharray(this.value);
  }

  /**
   *
   * @param {number} valueInPercent
   * @return {string}
   */
  private computeStrokeDasharray(valueInPercent: number): string {
    const MAX = 100;

    // fix SVG bugs
    if (valueInPercent === 100) {
      valueInPercent = 99.99;
    }
    if (valueInPercent === 0) {
      valueInPercent = -1;
    }

    return `${MAX - valueInPercent} ${MAX}`;
  }
}