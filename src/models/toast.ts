/**
 *
 */
export class Toast {
    constructor(
        public message: string,
        public options?: any
    ) {
        this.options = Object.assign({}, {
            // default options
            showSpinner: false,
            isError: false
        }, options);
    }
}