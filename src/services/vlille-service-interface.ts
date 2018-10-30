import { Observable } from "rxjs/Observable";
import { VlilleStation } from "../models/vlille-station";

export interface VlilleServiceInterface {
  getStation(id: number): Observable<VlilleStation>;
  getAllStations(): Observable<VlilleStation[]>;
}