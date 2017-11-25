import { VlilleStation } from '../models/vlille-station';
import { Observable } from 'rxjs/Observable';

export interface FavoritesServiceInterface {
  load(): Observable<VlilleStation[]>;
  save(stations: VlilleStation[]): Observable<VlilleStation[]>;
}