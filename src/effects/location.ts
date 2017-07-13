import { Injectable } from '@angular/core';
import { AppState } from '../app/app.reducers';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AlertController } from 'ionic-angular';
import * as Raven from 'raven-js';

import { ToastActions } from '../actions/toast';
import { LocationActions } from '../actions/location';
import { LocationService } from '../services/location';

@Injectable()
export class LocationEffects {
  constructor(
    private store$: Store<AppState>,
    private actions$: Actions,
    private locationService: LocationService,
    private alertController: AlertController,
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

  /**
   * Handler location update fail
   */
  @Effect() updateFail$: Observable<Action> = this.actions$
    .ofType(LocationActions.UPDATE_FAIL)
    .switchMap(action => {
      let error = action.payload;

      // Android only
      if (error && error.code !== new LocationAccuracy().ERROR_USER_DISAGREED) {

          // open popup asking for settings
          this.alertController.create({
              title: "Vliller a besoin de votre position",
              message: "Impossible d'activer le GPS automatiquement. Voulez-vous ouvrir les préférences et activer la localisation \"haute précision\" manuellement ?",
              buttons: [{
                  text: "Annuler",
                  handler: () => {
                      throw {
                        code: new LocationAccuracy().ERROR_USER_DISAGREED
                      };
                  }
              },
              {
                  text: "Ouvrir les paramètres",
                  handler: () => new Diagnostic().switchToLocationSettings()
              }]
          }).present();

          return Observable.empty();
      }

      // else, sends error to Sentry
      Raven.captureException(new Error(error));

      return Observable.of(
        new ToastActions.ShowError({
          message: "Impossible de récupérer votre position ! Vérifiez que votre GPS est activé.",
          options: {
            duration: 3000
          }
        })
      );
    });
}