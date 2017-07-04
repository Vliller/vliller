import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { StationsActions } from '../actions/stations';
import { VlilleService } from '../services/vlille/vlille';
import { VlilleStation } from '../models/vlillestation';

@Injectable()
export class StationsEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private vlilleService: VlilleService,
  ) {}

  /**
   * Load the stations from the V'Lille service
   */
  @Effect() loadStations$: Observable<Action> = this.actions$
    .ofType(StationsActions.LOAD)
    .startWith(new StationsActions.Load())
    .switchMap(() => this.vlilleService.getAllStations())
    .map(stations => new StationsActions.LoadSuccess(stations))
    .catch(error => Observable.of(new StationsActions.LoadFail(error)));

  /**
   * Adds a favorite through the FavoritesService
   */
  @Effect() updateActiveStation: Observable<Action> = this.actions$
    .ofType(StationsActions.UPDATE_ACTIVE)
    .switchMap(station => this.vlilleService.getStation(station.id))
    .map(station => new StationsActions.UpdateActiveSuccess(station))
    .catch(error => Observable.of(new StationsActions.UpdateActiveFail(error)));
}