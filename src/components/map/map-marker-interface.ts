export interface MarkerInterface {
  id;
  on(event: any, callback: Function);
  setIcon(icon: any);
}

export interface MapMarkerInterface {
  onClick(callback: Function);
  isEqual(marker: MapMarkerInterface);
  setIcon(icon: any);
  getMarker(): MarkerInterface;
}