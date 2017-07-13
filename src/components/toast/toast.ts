import { Component } from '@angular/core';
import { Toast } from '../../models/toast';

import { Store } from '@ngrx/store';
import { AppState } from '../../app/app.reducers';
import { selectToast } from '../../app/app.reducers';

@Component({
    selector: 'toast-component',
    template: `
        <div class="toast-component" [ngClass]="{ 'error': isError }" [hidden]="!showToast">
            <ion-spinner [hidden]="!showSpinner" color="light" ></ion-spinner>
            <span [innerHTML]="message"></span>
        </div>
    `
})

export class ToastComponent {
    public showToast: boolean = false;
    public showSpinner: boolean = false;
    public message: string;
    public isError: boolean = false;

    private durationId: number;

    constructor(private store: Store<AppState>) {
        this.store.select(state => selectToast(state)).subscribe((toast: Toast) => {
            if (toast) {
                this.show(toast);
            } else {
                this.hide();
            }
        });
    }

    /**
     *
     * @param {Toast} toast
     */
    private show(toast: Toast) {
        this.hide();

        this.message = toast.message;
        this.showSpinner = toast.options.showSpinner;
        this.isError = toast.options.isError;

        // show toast
        this.showToast = true;

        // clear potential toast with duration
        clearTimeout(this.durationId);
        this.durationId = null;

        if (toast.options && toast.options.duration) {
            // hide toast a the end of the given duration
            this.durationId = setTimeout(() => {
                this.hide();
                this.durationId = null;
            }, toast.options.duration);
        }
    }

    /**
     *
     */
    private hide() {
        this.showToast = false;
        this.showSpinner = false;

        // clear potential toast with duration
        clearTimeout(this.durationId);
        this.durationId = null;
    }
}