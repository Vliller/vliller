interface GoogleMapsMarker {
  id;
}

export interface MapMarkerInterface {
  onClick(callback: Function);
  isEqual(marker: GoogleMapsMarker);
  setIcon(icon: any);
}