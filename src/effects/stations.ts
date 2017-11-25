import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { map, startWith, switchMap, withLatestFrom, catchError } from 'rxjs/operators';

import { StationsActions } from '../actions/stations';
import { VlilleService } from '../services/vlille';
import { MapTools } from '../components/map/map-tools';
import { MapPosition } from '../models/map-position';
import { VlilleStation } from '../models/vlille-station';

@Injectable()
export class StationsEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private vlilleService: VlilleService
  ) {}

  /**
   * Load the stations from the V'Lille service
   */
  @Effect() loadStations$: Observable<Action> = this.actions$
    .ofType(StationsActions.LOAD)
    .pipe(
      startWith(new StationsActions.Load()),
      switchMap(() => {
        return this.vlilleService
          .getAllStations()
          .pipe(
            map(stations => new StationsActions.LoadSuccess(stations)),
            catchError(error => Observable.of(new StationsActions.LoadFail(error)))
          );
      })
    );

  /**
   * Updates active station
   */
  @Effect() updateActiveStation: Observable<Action> = this.actions$
    .ofType(StationsActions.UPDATE_ACTIVE)
    .pipe(
      // get store value
      withLatestFrom(this.store$),
      map(([action, state]: [StationsActions.UpdateActive, AppState]) => [action.payload, state.location.position, state.favorites.collection]),
      switchMap(([activeStation, position, favorites]: [VlilleStation, MapPosition, VlilleStation[]]) => {
        return this.vlilleService
          .getStation(activeStation.id)
          .pipe(
            map((station: VlilleStation) => {
              // computes distance between station and last known position
              station.distance = MapTools.computeDistance(MapPosition.fromCoordinates(station), position);

              // checks if the station is in favorites
              station.isFavorite = VlilleStation.contains(favorites, station);

              return new StationsActions.UpdateActiveSuccess(station);
            }),
            catchError(error => Observable.of(new StationsActions.UpdateActiveFail(error)))
          );
      })
    );
}