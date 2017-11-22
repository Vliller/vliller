import { Marker, MarkerIcon, ILatLng } from '@ionic-native/google-maps';
import { Observable } from 'rxjs/Observable';

export interface MapMarkerInterface {
  onClick(): Observable<ILatLng>;
  isEqual(marker: MapMarkerInterface);
  setIcon(icon: MarkerIcon);
  setMarker(marker: Marker);
  getMarker(): Marker;
  removeMarker();
}