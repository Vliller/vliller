import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ViewController, NavParams } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})

export class About {
    public contributors: Observable<any>;
    public contributorsLoaded: boolean = false;
    public appVersion: string;

    constructor(
        private http: Http,
        private viewCtrl: ViewController,
        private params: NavParams
    ) {
        this.contributors = this.getContributorsFromGithub();
        this.contributors.subscribe(() => this.contributorsLoaded = true);

        this.appVersion = params.get('appVersion');
    }

    private getContributorsFromGithub(): Observable<any> {
        return this.http
            .get('https://api.github.com/repos/alexetmanon/vliller/contributors')
            .map(response => response.json());
    }

    public close() {
        this.viewCtrl.dismiss();
    }

    public openGithubProfil(contributor) {
        new InAppBrowser(contributor.html_url, '_system');
    }
}