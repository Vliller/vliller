import { MapMarker } from '../components/map/map-marker';
import { VlilleStation, VlilleStationStatus } from './vlille-station';

export class VlilleStationMarker extends MapMarker {

  /**
   * @var VlilleStation
   */
  private station: VlilleStation

  constructor(marker: any, station: VlilleStation) {
    super(marker);

    this.setStation(station);
  }

  select() {
    throw new Error("Method not implemented.");
  }

  updateIcon() {
    throw new Error("Method not implemented.");
  }

  isAvailable(): boolean {
    return this.station.status === VlilleStationStatus.NORMAL;
  }

  setStation(station: VlilleStation) {
    this.station = station;
  }
}