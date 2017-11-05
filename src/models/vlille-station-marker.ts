import { MapMarker } from '../components/map/map-marker';
import { VlilleStation } from './vlille-station';

export class VlilleStationMarker extends MapMarker {

  /**
   * @var VlilleStation
   */
  station: VlilleStation

  constructor(marker: any, station: VlilleStation) {
    super(marker);
    this.station = station;
  }

  onClick() {
    throw new Error("Method not implemented.");
  }

  select() {
    throw new Error("Method not implemented.");
  }
}