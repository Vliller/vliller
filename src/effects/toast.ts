import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import * as Raven from 'raven-js';

import { ToastActions } from '../actions/toast';
import { FavoritesActions } from '../actions/favorites';
import { LocationActions } from '../actions/location';
import { LocationDisabledError } from '../services/location';

@Injectable()
export class ToastEffects {
  constructor(
    private actions$: Actions
  ) {}

  /**
   * Show a toast when a favorite is successfully added
   */
  @Effect() addFavoriteSuccess$: Observable<Action> = this.actions$
    .ofType(FavoritesActions.ADD_SUCCESS)
    .map((action: FavoritesActions.AddSuccess) => {
      return new ToastActions.Show({
        message: "Station <b>" + action.payload.name + "</b> ajoutée !",
        options: {
          duration: 3000
        }
      })
    });

  /**
   * Show a toast when a favorite is successfully removed
   */
  @Effect() removeFavoriteSuccess$: Observable<Action> = this.actions$
    .ofType(FavoritesActions.REMOVE_SUCCESS)
    .map((action: FavoritesActions.RemoveSuccess) => {
      return new ToastActions.Show({
        message: "Station <b>" + action.payload.name + "</b> retirée.",
        options: {
          duration: 3000
        }
      })
    });

  /**
   * Show an error toast when a favorite is successfully removed
   */
  @Effect() addFavoriteFailMaxSize$: Observable<Action> = this.actions$
    .ofType(FavoritesActions.ADD_FAIL_MAX_SIZE)
    .map(() => {
      return new ToastActions.ShowError({
        message: "Vous avez atteint le nombre maximum de favoris&nbsp;!",
        options: {
          duration: 3000
        }
      })
    });

  /**
   * Location update fail
   */
  @Effect() locationUpdateFail: Observable<Action> = this.actions$
    .ofType(LocationActions.UPDATE_FAIL)
    .map((action: LocationActions.UpdateFail) => {
      let error = action.payload;

      if (error instanceof LocationDisabledError) {
        return new ToastActions.ShowError({
          message: "Vous devez activer votre GPS pour utiliser cette fonctionnalité.",
          options: {
            duration: 3000
          }
        });
      }

      // else, sends error to Sentry
      Raven.captureException(new Error(error));

      return new ToastActions.ShowError({
        message: "Impossible de récupérer votre position&nbsp;! Vérifiez que votre GPS est activé.",
        options: {
          duration: 3000
        }
      });
    });
}