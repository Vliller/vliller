import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { LocationActions } from '../actions/location';
import { LocationService } from '../services/location';

@Injectable()
export class LocationEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private locationService: LocationService,
  ) {}

  /**
   * Request location
   */
  @Effect() request$: Observable<Action> = this.actions$
    .ofType(LocationActions.REQUEST)
    .startWith(new LocationActions.Request())
    .switchMap(() => Observable.fromPromise(
      this.locationService
      .requestLocation()
      .then(() => new LocationActions.RequestSuccess())
      .catch(error => new LocationActions.RequestFail(error))
    ));

  // Update position after request successfully
  @Effect() requestSuccess$: Observable<Action> = this.actions$
    .ofType(LocationActions.REQUEST_SUCCESS)
    .map(() => new LocationActions.Update());

  /**
   * Update current position
   */
  @Effect() update$: Observable<Action> = this.actions$
    .ofType(LocationActions.UPDATE)
    .switchMap(() => Observable.fromPromise(
      this.locationService
      .getCurrentPosition()
      .then(position => new LocationActions.UpdateSuccess(position))
      .catch(error => new LocationActions.UpdateFail(error))
    ));
}