interface GoogleMapsMarker {
  id;
}

export interface MapMarkerInterface {
  onClick(callback: Function);
  select();
  isEqual(marker: GoogleMapsMarker);
  setIcon(icon: any);
}