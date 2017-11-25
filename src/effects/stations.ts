import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { StationsActions } from '../actions/stations';
import { VlilleService } from '../services/vlille';
import { MapService } from '../services/map';
import { MapPosition } from '../models/map-position';
import { VlilleStation } from '../models/vlille-station';

@Injectable()
export class StationsEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private vlilleService: VlilleService,
    private mapService: MapService
  ) {}

  /**
   * Load the stations from the V'Lille service
   */
  @Effect() loadStations$: Observable<Action> = this.actions$
    .ofType(StationsActions.LOAD)
    .startWith(new StationsActions.Load())
    .switchMap(() => {
      return this.vlilleService
        .getAllStations()
        .map(stations => new StationsActions.LoadSuccess(stations))
        .catch(error => Observable.of(new StationsActions.LoadFail(error)));
    });

  /**
   * Updates active station
   */
  @Effect() updateActiveStation: Observable<Action> = this.actions$
    .ofType(StationsActions.UPDATE_ACTIVE)
    // get store value
    .withLatestFrom(this.store$)
    .map(([action, state]: [StationsActions.UpdateActive, AppState]) => [action.payload, state.location.position, state.favorites.collection])
    .switchMap(([activeStation, position, favorites]: [VlilleStation, MapPosition, VlilleStation[]]) => {
      return this.vlilleService
        .getStation(activeStation.id)
        .map(station => {
          // computes distance between station and last known position
          station.distance = this.mapService.computeDistance(MapPosition.fromCoordinates(station), position);

          // checks if the station is in favorites
          station.isFavorite = this.contains(favorites, station);

          return new StationsActions.UpdateActiveSuccess(station);
        })
        .catch(error => Observable.of(new StationsActions.UpdateActiveFail(error)));
    });

  /**
   * Simple contains function base on element id
   * @param  {VlilleStation[]} collection
   * @param  {VlilleStation}   element
   * @return {boolean}
   */
  private contains(collection: VlilleStation[], element: VlilleStation): boolean {
    if (!element) {
      return false;
    }

    // compare elements id
    for (let currentElement of collection) {
      if (currentElement.id === element.id) {
        return true;
      }
    }

    return false;
  }
}