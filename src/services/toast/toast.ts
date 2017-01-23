/**
 * TODO: Adds config options
 *
 * Dependencies :
 * - https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
 */

import { Injectable } from '@angular/core';
import { Toast } from 'ionic-native';

@Injectable()
export class ToastService {
    private defaultConfig: any;
    private errorDefaultConfig: any;

    constructor() {
        // global config
        this.defaultConfig = {
            duration: 'short',
            position: 'bottom',
            styling: {
                opacity: 1,
                cornerRadius: 2,
                backgroundColor: '#323232',
            }
        };

        // extend global config
        this.errorDefaultConfig = Object.assign({}, this.defaultConfig, {
            styling: {
                backgroundColor: '#e52b38',
            }
        });
    }

    /**
     *
     * @param {string} message
     * @param {number} duration
     */
    public show(message: string, duration: number) {
        duration = duration || this.defaultConfig.duration;

        Toast.showWithOptions({
            message: message,
            duration: duration,
            position: this.defaultConfig.position,
            styling: this.defaultConfig.styling
        });
    }

    /**
     *
     * @param {string} message
     * @param {number} duration
     */
    public showError(message: string, duration: number) {
        duration = duration || duration || this.errorDefaultConfig.duration;

        Toast.showWithOptions({
            message: message,
            duration: duration,
            position: this.errorDefaultConfig.position,
            styling: this.errorDefaultConfig.styling
        });
    }
}