import { MapMarkerInterface, MarkerInterface } from './map-marker-interface';

declare var plugin: any;

export class MapMarker implements MapMarkerInterface {

  protected marker: MarkerInterface;

  constructor(marker: MarkerInterface) {
    this.marker = marker;
  }

  onClick(callback: Function) {
    return this.marker.on(plugin.google.maps.event.MARKER_CLICK, callback);
  }

  isEqual(marker: MapMarkerInterface) {
    return this.marker.id === marker.getMarker().id;
  }

  setIcon(icon: any) {
    this.marker.setIcon(icon);
  }

  setMarker(marker: MarkerInterface) {
    this.removeMarker();
    this.marker = marker;
  }

  getMarker(): MarkerInterface {
    return this.marker;
  }

  removeMarker() {
    this.marker.remove();
    this.marker = undefined;
  }
}