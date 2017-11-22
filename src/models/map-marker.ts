import { GoogleMapsEvent, Marker, ILatLng, MarkerIcon } from '@ionic-native/google-maps';
import { MapMarkerInterface } from './map-marker-interface';
import { Observable } from 'rxjs/Observable';

export class MapMarker implements MapMarkerInterface {

  protected marker: Marker;

  constructor(marker: Marker) {
    this.marker = marker;
  }

  onClick(): Observable<ILatLng> {
    return this.marker.on(GoogleMapsEvent.MARKER_CLICK);
  }

  isEqual(marker: MapMarkerInterface) {
    return this.marker.getId() === marker.getMarker().getId();
  }

  setIcon(icon: MarkerIcon) {
    this.marker.setIcon(icon);
  }

  setMarker(marker: Marker) {
    this.removeMarker();
    this.marker = marker;
  }

  getMarker(): Marker {
    return this.marker;
  }

  removeMarker() {
    this.marker.remove();
    this.marker = undefined;
  }
}