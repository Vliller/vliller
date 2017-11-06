export interface MarkerInterface {
  id;
  on(event: any, callback: Function);
  setIcon(icon: any);
  setCenter(center: any);
  setRotation(heading: number);
}

export interface MapMarkerInterface {
  onClick(callback: Function);
  isEqual(marker: MapMarkerInterface);
  setIcon(icon: any);
  getMarker(): MarkerInterface;
}