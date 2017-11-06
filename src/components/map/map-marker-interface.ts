export interface MarkerInterface {
  id;
  on(event: any, callback: Function);
  remove();
  setIcon(icon: any);
  setPosition(latLng: any);
  setRotation(heading: number);
}

export interface CircleInterface {
  id;
  setCenter(latLng: any);
  setRadious(radius: number);
}

export interface MapMarkerInterface {
  onClick(callback: Function);
  isEqual(marker: MapMarkerInterface);
  setIcon(icon: any);
  setMarker(marker: MarkerInterface);
  getMarker(): MarkerInterface;
  removeMarker();
}