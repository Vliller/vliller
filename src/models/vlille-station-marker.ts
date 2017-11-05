import { MapMarker } from '../components/map/map-marker';
import { VlilleStation, VlilleStationStatus } from './vlille-station';

declare var plugin: any;

export class VlilleStationMarker extends MapMarker {

  /**
   * @var VlilleStation
   */
  private station: VlilleStation

  constructor(marker: any, station: VlilleStation) {
    super(marker);

    this.setStation(station);
  }

  onClick(callback: Function) {
    this.marker.on(plugin.google.maps.event.MARKER_CLICK, callback);
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