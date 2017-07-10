import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import { LocationActions } from '../actions/location';
import { LocationService } from '../services/location/location';

@Injectable()
export class ToastEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private locationService: LocationService
  ) {}

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