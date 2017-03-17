import { Component } from '@angular/core';
import { InAppBrowser } from 'ionic-native';

@Component({
    selector: 'aetm-footer',
    templateUrl: 'aetm-footer.html'
})

export class AetmFooter {

    public openLink(link) {
        new InAppBrowser(link, '_system');
    }
}