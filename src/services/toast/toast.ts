import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';

export class Toast {
    constructor(
        public message: string,
        public options?: any
    ) {}
}

@Injectable()
export class ToastService {
    private toastStateSource = new ReplaySubject<Toast>();

    public asObservable(): Observable<Toast> {
        return this.toastStateSource.asObservable();
    }

    public show(message: string, options?: any) {
        this.toastStateSource.next(new Toast(message, options));
    }

    public hide() {
        this.toastStateSource.next(null);
    }
}