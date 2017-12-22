import { MapPosition } from "../models/map-position";

export interface LocationServiceInterface {
  getCurrentPosition(): Promise<MapPosition>;
  requestLocation(): Promise<any>;
}