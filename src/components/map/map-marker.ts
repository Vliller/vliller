import { MapMarkerInterface } from './map-marker-interface';

declare var plugin: any;

export abstract class MapMarker implements MapMarkerInterface {

  /**
   * @var google.maps.Marker
   */
  marker: any;

  constructor(marker: any) {
    this.marker = marker;

    this.marker.on(plugin.google.maps.event.MARKER_CLICK, this.onClick);
  }

  abstract onClick();

  abstract select();
}