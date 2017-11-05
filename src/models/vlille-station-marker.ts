import { MapMarker } from '../components/map/map-marker';
import { MapIcon, DynamicMapIcon } from '../components/map/map-icon';
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

  updateIcon(isMapUnzoom: boolean, isActive: boolean = false) {
    // active marker
    if (isActive) {
      if (this.isAvailable()) {
        this.marker.setIcon(MapIcon.NORMAL_ACTIVE);
      } else {
        this.marker.setIcon(MapIcon.UNAVAILABLE_ACTIVE);
      }

      return;
    }

    // unactive marker
    if (isMapUnzoom) {
      if (this.isAvailable()) {
          this.marker.setIcon(MapIcon.NORMAL_SMALL);
      } else {
          this.marker.setIcon(MapIcon.UNAVAILABLE_SMALL);
      }
    } else {
      if (this.isAvailable()) {
          this.marker.setIcon(DynamicMapIcon.getIcon(this.station.usageInPercent));
      } else {
          this.marker.setIcon(MapIcon.UNAVAILABLE);
      }
    }


  }

  isAvailable(): boolean {
    return this.station.status === VlilleStationStatus.NORMAL;
  }

  setStation(station: VlilleStation) {
    this.station = station;
  }
}