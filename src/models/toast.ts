/**
 *
 */

export interface ToastOptionsInterface {
    showSpinner?: boolean;
    isError?: boolean;
    duration?: number;
}

export class Toast {
    constructor(
        public message: string,
        public options?: ToastOptionsInterface
    ) {
        this.options = Object.assign({}, {
            // default options
            showSpinner: false,
            isError: false
        }, options);
    }
}