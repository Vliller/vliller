import { MapMarker } from './map-marker';
import { MapIcon, DynamicMapIcon } from '../components/map/map-icon';
import { VlilleStation, VlilleStationStatus } from './vlille-station';

export class VlilleStationMarker extends MapMarker {

  protected station: VlilleStation
  protected isStationActive: boolean = false;

  constructor(marker: any, station: VlilleStation) {
    super(marker);

    this.setStation(station);
  }

  static create(mapInstance: any, station: VlilleStation): Promise<VlilleStationMarker> {
    return new Promise((resolve, reject) => {
      mapInstance.addMarker({
        position: {
            lat: station.latitude,
            lng: station.longitude
        },
        icon: station.status === VlilleStationStatus.NORMAL ? DynamicMapIcon.getIcon(station.fulfillmentInPercent) : MapIcon.UNAVAILABLE,
        disableAutoPan: true
      }, marker => {
        resolve(new VlilleStationMarker(marker, station));
      });
    });
  }

  updateIcon() {
    // active marker
    if (this.isActive()) {
      if (this.isAvailable()) {
        this.marker.setIcon(MapIcon.ACTIVE);
      } else {
        this.marker.setIcon(MapIcon.UNAVAILABLE_ACTIVE);
      }

      return;
    }

    // unactive marker
    if (this.isAvailable()) {
      this.marker.setIcon(DynamicMapIcon.getIcon(this.station.fulfillmentInPercent));
    } else {
      this.marker.setIcon(MapIcon.UNAVAILABLE);
    }
  }

  isAvailable(): boolean {
    return this.station.status === VlilleStationStatus.NORMAL;
  }

  isActive(): boolean {
    return this.isStationActive;
  }

  setActive(isActive: boolean) {
    this.isStationActive = isActive;
  }

  setStation(station: VlilleStation) {
    this.station = station;
  }
}