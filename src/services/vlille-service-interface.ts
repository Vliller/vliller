import { Observable } from "rxjs/Observable";
import { VlilleStation } from "../models/vlille-station";

export interface VlilleServiceInterface {
  getStation(id: string): Observable<VlilleStation>;
  getAllStations(): Observable<VlilleStation[]>;
}