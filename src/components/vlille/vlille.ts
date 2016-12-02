import { Injectable } from '@angular/core';

/**
 *
 */
export class VlilleStationResume {
    constructor(
        public id: string,
        public name: string,
        public latitude: number,
        public longitude: number
    ) {}
}

/**
 *
 */
export class VlilleStationDetails {
    constructor(
        public address: string,
        public bikes: number,
        public docks: number,
        public payment: string,
        public status: string,
        public lastupd: string
    ) {}
}

@Injectable()
export class Vlille {
    get(): VlilleStationDetails {
        // TODO
        return null;
    }

    getAll(): VlilleStationResume[] {
        // TODO
        return [];
    }
}