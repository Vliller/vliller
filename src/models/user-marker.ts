import { Marker, Circle } from '@ionic-native/google-maps';
import { MapMarker } from './map-marker';
import { MapIcon } from '../components/map/map-icon';
import { MapPosition } from '../models/map-position';
import { Observable } from 'rxjs/Observable';

export class UserMarker extends MapMarker {

  protected accuracyCircle: any;

  constructor(marker: Marker, accuracyCircle: Circle) {
    super(marker);

    this.accuracyCircle = accuracyCircle;
  }

  static create(mapInstance: any, position: MapPosition): Promise<UserMarker> {
    // Create user position marker
    let markerPromise = new Promise<any>((resolve, reject) => {
      mapInstance.addMarker({
        position: position.toLatLng(),
        icon: MapIcon.USER,
        disableAutoPan: true
      }, marker => resolve(marker));
    });

    return new Promise<UserMarker>((resolve, reject) => {
      // Create a circle to represent the user position accuracy
      mapInstance.addCircle({
        center: position.toLatLng(),
        radius: position.accuracy,
        strokeWidth: 0,
        strokeColor: 'rgba(0, 0, 0, 0)',
        fillColor: 'rgba(25, 209, 191, 0.15)' // #19D1BF + opacity = 15%,
      }, accuracyCircle => {
        // finally, create UserMarker object
        markerPromise.then(marker => {
          resolve(new UserMarker(marker, accuracyCircle));
        });
      });
    });
  }

  setPosition(position: MapPosition) {
    let latLng = position.toLatLng();

    this.marker.setPosition(latLng);
    this.accuracyCircle.setCenter(latLng);

    // set accuracy from position data
    this.setAccuracy(position.accuracy);
  }

  setHeading(heading: number) {
    this.marker.setRotation(heading);
  }

  setAccuracy(accuracy: number) {
    this.accuracyCircle.setRadius(accuracy);
  }

  /**
   * NO-OP
   */
  onClick(): Observable<any> {
    return Observable.empty();
  }
}