import { Marker, MarkerIcon, ILatLng } from '@ionic-native/google-maps';
import { Observable } from 'rxjs/Observable';

export interface MapMarkerInterface {
  onClick(): Observable<ILatLng>;
  isEqual(marker: MapMarkerInterface): void;
  setIcon(icon: MarkerIcon): void;
  setMarker(marker: Marker): void;
  getMarker(): Marker;
  removeMarker(): void;
}