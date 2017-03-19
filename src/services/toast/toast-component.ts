import { Component } from '@angular/core';
import { ToastService, Toast } from './toast';

@Component({
    selector: 'toast-component',
    template: `
        <div class="toast-component" [hidden]="!showToast">
            <ion-spinner [hidden]="!showSpinner" color="light" ></ion-spinner>
            <span [innerHTML]="message"></span>
        </div>
    `
})

export class ToastComponent {
    public showToast: boolean = false;
    public showSpinner: boolean = false;
    public message: string;

    private durationId: number;

    constructor(private toastService: ToastService) {
        this.toastService.asObservable().subscribe(toast => {
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
        this.showSpinner = toast.options && toast.options.showSpinner || false;

        // show toast
        this.showToast = true;

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