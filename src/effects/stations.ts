import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { StationsActions } from '../actions/stations';
import { VlilleService } from '../services/vlille/vlille';
import { MapService } from '../services/map/map';
import { MapPosition } from '../models/map-position';

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
    .map(([action, state]) => [action.payload, state.location.position])
    .switchMap(([station, position]) => {
      return this.vlilleService
        .getStation(station.id)

        // compute distance between station and last known position
        .map(station => {
          station.distance = this.mapService.computeDistance(MapPosition.fromCoordinates(station), position)

          return station;
        })

        .map(station => new StationsActions.UpdateActiveSuccess(station))
        .catch(error => Observable.of(new StationsActions.UpdateActiveFail(error)));
    });
}