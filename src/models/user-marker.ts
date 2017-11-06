import { MapMarker } from '../components/map/map-marker';
import { MapIcon } from '../components/map/map-icon';
import { MapPosition } from '../models/map-position';

export class UserMarker extends MapMarker {

  protected accuracyMarker: any;

  constructor(marker:any, accuracyMarker: any) {
    super(marker);

    this.accuracyMarker = accuracyMarker;
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
      }, markerAccuracy => {
        // finally, create UserMarker object
        markerPromise.then(marker => {
          resolve(new UserMarker(marker, markerAccuracy));
        });
      });
    });
  }

  setPosition(position) {
    this.marker.setCenter(position);
  }

  setHeading(heading: number) {
    this.marker.setRotation(heading);
  }

  setAccuracy(accuracy: number) {
    this.accuracyMarker.setRadius(accuracy);
  }

  // NO-OP
  onClick() {}
}