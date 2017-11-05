import { MapMarker } from '../components/map/map-marker';

export class UserMarker extends MapMarker {

  // NO-OP
  onClick() {}

  // NO-OP
  select() {}

  setPosition() {
    throw new Error("Method not implemented.");
  }

  setHeading() {
    throw new Error("Method not implemented.");
  }
}